import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canonicalizeEmail } from "@/lib/abuse";
import { createSession, getUserAccessStatus } from "@/lib/auth";
import { safeEqual, verificationHash } from "@/lib/app-api";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { email?: string; code?: string };
    const email = canonicalizeEmail(body.email || "");
    const code = body.code?.trim() || "";
    if (!email || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    const record = await db.appVerificationCode.findFirst({
      where: { email, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (!record || !record.userId || record.attempts >= 5 || !safeEqual(record.codeHash, verificationHash(email, code))) {
      if (record) {
        await db.appVerificationCode.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
      }
      return NextResponse.json({ error: "Verification code is wrong or expired" }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id: record.userId },
      data: { emailVerifiedAt: new Date() },
    });
    await db.appVerificationCode.deleteMany({ where: { email } });
    const [session, access] = await Promise.all([
      createSession(user.id),
      getUserAccessStatus(user.id),
    ]);
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        uniqueUserCode: user.uniqueUserCode,
        activationCode: access.activationCode,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
      },
      trial: access.trial,
      access: access.access,
    });
    response.cookies.set("ordal-session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
