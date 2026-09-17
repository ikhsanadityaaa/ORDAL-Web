import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { maybeCleanupExpiredAppData } from "@/lib/abuse";
import { appError } from "@/lib/app-route";
import { AppApiError, deviceFromBody, deviceKey } from "@/lib/app-api";

function base64url(value: Buffer) {
  return value.toString("base64url");
}

export async function POST(req: Request) {
  try {
    await maybeCleanupExpiredAppData();
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const appUrl = process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (!clientId || !appUrl) throw new AppApiError(503, "GOOGLE_NOT_CONFIGURED", "Login Google belum dikonfigurasi");
    const body = await req.json() as Record<string, unknown>;
    const device = deviceFromBody(body);
    const key = deviceKey(device.fingerprint);
    const recent = await db.appOAuthAttempt.count({
      where: { deviceKey: key, createdAt: { gt: new Date(Date.now() - 15 * 60 * 1000) } },
    });
    if (recent >= 5) throw new AppApiError(429, "OAUTH_RATE_LIMIT", "Terlalu banyak percobaan login Google");
    const state = base64url(randomBytes(24));
    const verifier = base64url(randomBytes(48));
    const challenge = base64url(createHash("sha256").update(verifier).digest());
    await db.appOAuthAttempt.create({
      data: {
        state,
        codeVerifier: verifier,
        deviceKey: key,
        deviceName: device.name || "Device",
        os: device.os || "",
        appVersion: device.appVersion || "",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    const redirectUri = `${appUrl.replace(/\/$/, "")}/api/app/auth/google/callback`;
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge", challenge);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("prompt", "select_account");
    return NextResponse.json({ state, auth_url: url.toString(), url: url.toString() });
  } catch (error) {
    return appError(error);
  }
}
