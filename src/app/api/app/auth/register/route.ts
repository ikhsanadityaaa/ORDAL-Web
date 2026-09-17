import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { assertEmailAllowed, canonicalizeEmail, guardRegistration, recordAbuseEvent, requestSignals } from "@/lib/abuse";
import { generateUserCode, hashPassword } from "@/lib/auth";
import { appError } from "@/lib/app-route";
import { deviceFromBody, randomVerificationCode, sendVerificationEmail, verificationHash } from "@/lib/app-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const device = deviceFromBody(body);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 100) {
      return NextResponse.json({ detail: "Email atau password tidak valid" }, { status: 400 });
    }
    assertEmailAllowed(email);
    const signals = requestSignals(req, device.fingerprint);
    await guardRegistration(signals.ipHash, signals.deviceHash);
    await Promise.all([
      recordAbuseEvent("register_attempt", signals.ipHash, undefined, "ip"),
      recordAbuseEvent("register_attempt", signals.deviceHash, undefined, "device"),
    ]);

    const canonical = canonicalizeEmail(email);
    if (await db.user.findFirst({ where: { OR: [{ email }, { emailCanonical: canonical }] } })) {
      return NextResponse.json({ detail: "Email sudah terdaftar" }, { status: 409 });
    }

    let uniqueUserCode = generateUserCode();
    while (await db.user.findUnique({ where: { uniqueUserCode } })) uniqueUserCode = generateUserCode();
    const code = randomVerificationCode();
    const user = await db.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          emailCanonical: canonical,
          name: name || email.split("@")[0],
          password: await hashPassword(password),
          authProvider: "email",
          uniqueUserCode,
        },
      });
      await tx.appVerificationCode.create({
        data: {
          email: canonical,
          userId: created.id,
          codeHash: verificationHash(canonical, code),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
      return created;
    });
    await sendVerificationEmail(email, code);
    await recordAbuseEvent("register_created", signals.deviceHash, user.id);
    return NextResponse.json({
      email,
      requires_verification: true,
      smtp_configured: true,
      ...(process.env.NODE_ENV !== "production" ? { dev_code: code } : {}),
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ detail: "Email sudah terdaftar" }, { status: 409 });
    }
    if (error instanceof Error && error.message === "DISPOSABLE_EMAIL") {
      return NextResponse.json({ detail: "Email sementara tidak diizinkan" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "REGISTER_RATE_LIMIT") {
      return NextResponse.json(
        { detail: { code: "REGISTER_RATE_LIMIT", message: "Terlalu banyak percobaan pendaftaran. Coba lagi nanti" } },
        { status: 429 },
      );
    }
    return appError(error);
  }
}
