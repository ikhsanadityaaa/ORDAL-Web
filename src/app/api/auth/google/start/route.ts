import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { appUrl } from "@/lib/app-url";

const COOKIE_PATH = "/api/auth/google";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const baseUrl = appUrl();
  if (!clientId || !baseUrl) {
    return NextResponse.redirect(new URL("/?auth=login&google=unavailable", req.url));
  }
  if (req.nextUrl.origin !== baseUrl) {
    return NextResponse.redirect(`${baseUrl}/api/auth/google/start`);
  }

  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(url);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 10 * 60,
    path: COOKIE_PATH,
  };
  response.cookies.set("ordal-google-state", state, cookieOptions);
  response.cookies.set("ordal-google-verifier", verifier, cookieOptions);
  response.headers.set("cache-control", "no-store");
  return response;
}
