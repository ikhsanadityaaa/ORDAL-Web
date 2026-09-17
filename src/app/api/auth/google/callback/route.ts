import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appUrl } from "@/lib/app-url";
import { canonicalizeEmail, emailSignal, recordAbuseEvent } from "@/lib/abuse";
import { createSession, generateUserCode } from "@/lib/auth";

const COOKIE_PATH = "/api/auth/google";

function equalState(received: string, expected: string) {
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function finish(req: NextRequest, status: "success" | "failed") {
  const url = new URL("/", req.url);
  url.searchParams.set("google", status);
  if (status === "failed") url.searchParams.set("auth", "login");
  const response = NextResponse.redirect(url);
  response.cookies.set("ordal-google-state", "", { maxAge: 0, path: COOKIE_PATH });
  response.cookies.set("ordal-google-verifier", "", { maxAge: 0, path: COOKIE_PATH });
  return response;
}

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state") || "";
  const code = req.nextUrl.searchParams.get("code") || "";
  const expectedState = req.cookies.get("ordal-google-state")?.value || "";
  const verifier = req.cookies.get("ordal-google-verifier")?.value || "";
  if (!state || !code || !expectedState || !verifier || !equalState(state, expectedState)) {
    return finish(req, "failed");
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || "";
    const redirectUri = `${appUrl()}/api/auth/google/callback`;
    if (!clientId || !clientSecret) return finish(req, "failed");

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code", code_verifier: verifier }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) throw new Error("token_exchange_failed");
    const token = await tokenResponse.json() as { access_token?: string };
    if (!token.access_token) throw new Error("missing_access_token");

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: "no-store",
    });
    if (!profileResponse.ok) throw new Error("profile_failed");
    const profile = await profileResponse.json() as { email?: string; email_verified?: boolean; name?: string };
    if (!profile.email || !profile.email_verified) throw new Error("email_not_verified");

    const email = profile.email.trim().toLowerCase();
    const canonical = canonicalizeEmail(email);
    let user = await db.user.findFirst({ where: { OR: [{ email }, { emailCanonical: canonical }] } });
    if (!user) {
      let uniqueUserCode = generateUserCode();
      while (await db.user.findUnique({ where: { uniqueUserCode } })) uniqueUserCode = generateUserCode();
      user = await db.user.create({
        data: {
          email,
          emailCanonical: canonical,
          name: profile.name?.trim().slice(0, 120) || email.split("@")[0],
          authProvider: "google",
          uniqueUserCode,
          emailVerifiedAt: new Date(),
        },
      });
    } else if (!user.emailVerifiedAt) {
      user = await db.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date() } });
    }

    const session = await createSession(user.id);
    await recordAbuseEvent("login_success", emailSignal(email), user.id, "google_web");
    const response = finish(req, "success");
    response.cookies.set("ordal-session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Google web login error:", error instanceof Error ? error.message : "unknown");
    return finish(req, "failed");
  }
}
