import { NextRequest, NextResponse } from "next/server";

/* Geo-based default language for first-time visitors.
   (Next.js 16 convention: "proxy" replaces the old "middleware" file.)

   The visitor's country comes from the hosting platform automatically:
   - Vercel  → x-vercel-ip-country header on every request
   - Cloudflare-hosted → cf-ipcountry
   No external geolocation API is needed.

   Indonesia → default "id", anywhere else → default "en".
   This is only a HINT: the user's explicit choice (language toggle,
   stored in localStorage "ordal-language") always wins on the client.

   Local dev / hosts without geo headers → the cookie falls back to
   "id" (ORDAL's home market). */
export function proxy(req: NextRequest) {
  const country =
    req.headers.get("x-vercel-ip-country")?.toUpperCase() ||
    req.headers.get("cf-ipcountry")?.toUpperCase() ||
    null;

  const defaultLang = country ? (country === "ID" ? "id" : "en") : "id";

  const res = NextResponse.next();
  res.cookies.set("ordal-geo-lang", defaultLang, {
    maxAge: 60 * 60 * 24 * 30, // 30 days, refreshed on every request
    sameSite: "lax",
    path: "/",
  });
  return res;
}

export const config = {
  // Skip static assets; run for pages and API routes.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
