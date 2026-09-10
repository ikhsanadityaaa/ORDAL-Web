import { NextRequest, NextResponse } from "next/server";

// This route redirects to the main page with auth parameter
// Used by download/CTA buttons to trigger the auth flow
export async function GET(req: NextRequest) {
  // Check if user is already authenticated via session cookie
  // For simplicity, always redirect to login
  const url = new URL("/", req.url);
  url.searchParams.set("auth", "login");

  return NextResponse.redirect(url);
}
