import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canonicalizeEmail } from "@/lib/abuse";
import { generateUserCode } from "@/lib/auth";
import { appUrl } from "@/lib/app-url";

function page(ok: boolean, message: string) {
  const title = ok ? "Login berhasil" : "Login gagal";
  return new NextResponse(`<!doctype html><meta charset="utf-8"><title>${title}</title><body style="font-family:sans-serif;padding:40px"><h1>${title}</h1><p>${message}</p><p>Jendela ini boleh ditutup.</p></body>`, {
    status: ok ? 200 : 400,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state") || "";
  const code = req.nextUrl.searchParams.get("code") || "";
  const oauthError = req.nextUrl.searchParams.get("error") || "";
  const attempt = state ? await db.appOAuthAttempt.findUnique({ where: { state } }) : null;
  if (!attempt || attempt.expiresAt <= new Date()) return page(false, "Permintaan login sudah kedaluwarsa.");
  if (oauthError || !code) {
    await db.appOAuthAttempt.update({ where: { state }, data: { status: "error", error: oauthError || "missing_code", completedAt: new Date() } });
    return page(false, "Google membatalkan login.");
  }
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || "";
    const redirectUri = `${appUrl()}/api/app/auth/google/callback`;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code", code_verifier: attempt.codeVerifier }),
    });
    if (!tokenResponse.ok) throw new Error("token_exchange_failed");
    const token = await tokenResponse.json() as { access_token?: string };
    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${token.access_token || ""}` },
    });
    if (!profileResponse.ok) throw new Error("profile_failed");
    const profile = await profileResponse.json() as { email?: string; email_verified?: boolean; name?: string };
    if (!profile.email || !profile.email_verified) throw new Error("email_not_verified");
    const email = profile.email.toLowerCase();
    const canonical = canonicalizeEmail(email);
    let user = await db.user.findFirst({ where: { OR: [{ email }, { emailCanonical: canonical }] } });
    if (!user) {
      let uniqueUserCode = generateUserCode();
      while (await db.user.findUnique({ where: { uniqueUserCode } })) uniqueUserCode = generateUserCode();
      user = await db.user.create({
        data: { email, emailCanonical: canonical, name: profile.name?.slice(0, 120) || email.split("@")[0], authProvider: "google", uniqueUserCode, emailVerifiedAt: new Date() },
      });
    } else if (!user.emailVerifiedAt) {
      user = await db.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date() } });
    }
    await db.appOAuthAttempt.update({ where: { state }, data: { status: "completed", userId: user.id, completedAt: new Date() } });
    return page(true, "Kembali ke aplikasi ORDAL untuk melanjutkan.");
  } catch (error) {
    await db.appOAuthAttempt.update({ where: { state }, data: { status: "error", error: error instanceof Error ? error.message.slice(0, 120) : "oauth_error", completedAt: new Date() } });
    return page(false, "Identitas Google tidak dapat diverifikasi.");
  }
}
