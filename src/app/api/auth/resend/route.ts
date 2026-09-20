import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canonicalizeEmail } from "@/lib/abuse";
import { randomVerificationCode, sendVerificationEmail, verificationHash } from "@/lib/app-api";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { email?: string };
    const email = canonicalizeEmail(body.email || "");
    if (!email) return NextResponse.json({ ok: true });

    const user = await db.user.findFirst({ where: { OR: [{ email }, { emailCanonical: email }] } });
    if (!user || user.emailVerifiedAt) return NextResponse.json({ ok: true });

    const recent = await db.appVerificationCode.findFirst({ where: { email }, orderBy: { sentAt: "desc" } });
    if (recent && recent.sentAt.getTime() > Date.now() - 60_000) {
      return NextResponse.json({ error: "Wait 60 seconds before requesting another code" }, { status: 429 });
    }
    const code = randomVerificationCode();
    await db.appVerificationCode.create({
      data: {
        email,
        userId: user.id,
        codeHash: verificationHash(email, code),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    await sendVerificationEmail(user.email, code);
    return NextResponse.json({ ok: true, ...(process.env.NODE_ENV !== "production" ? { devCode: code } : {}) });
  } catch (error) {
    console.error("Resend email error:", error);
    return NextResponse.json({ error: "Verification email could not be sent" }, { status: 502 });
  }
}
