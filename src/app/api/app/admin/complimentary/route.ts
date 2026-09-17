import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canonicalizeEmail } from "@/lib/abuse";

function authorized(req: Request) {
  const expected = process.env.ADMIN_API_TOKEN?.trim() || "";
  const supplied = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  const left = Buffer.from(expected);
  const right = Buffer.from(supplied);
  return expected.length >= 32 && left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json() as { email?: string; enabled?: boolean };
  const email = canonicalizeEmail(body.email || "");
  const user = await db.user.findFirst({ where: { OR: [{ email }, { emailCanonical: email }] } });
  if (!user) return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  await db.user.update({ where: { id: user.id }, data: { complimentaryAccess: body.enabled !== false } });
  return NextResponse.json({ ok: true, email: user.email, complimentaryAccess: body.enabled !== false });
}
