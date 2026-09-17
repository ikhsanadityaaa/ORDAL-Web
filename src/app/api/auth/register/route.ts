import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  generateUserCode,
  hashPassword,
} from "@/lib/auth";
import { randomVerificationCode, sendVerificationEmail, verificationHash } from "@/lib/app-api";
import {
  assertEmailAllowed,
  canonicalizeEmail,
  guardRegistration,
  recordAbuseEvent,
  requestSignals,
} from "@/lib/abuse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const deviceId = typeof body.deviceId === "string" ? body.deviceId.slice(0, 128) : "";

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    try {
      assertEmailAllowed(email);
    } catch {
      return NextResponse.json(
        { error: "Temporary email addresses are not allowed" },
        { status: 400 }
      );
    }

    const canonicalEmail = canonicalizeEmail(email);
    const signals = requestSignals(req, deviceId);
    try {
      await guardRegistration(signals.ipHash, signals.deviceHash);
    } catch {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }
    await Promise.all([
      recordAbuseEvent("register_attempt", signals.ipHash, undefined, "ip"),
      recordAbuseEvent("register_attempt", signals.deviceHash, undefined, "device"),
    ]);

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }
    if (password.length > 100) {
      return NextResponse.json(
        { error: "Password must be at most 100 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { emailCanonical: canonicalEmail }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered. Please sign in." },
        { status: 409 }
      );
    }

    // Generate unique user code
    let uniqueUserCode = generateUserCode();
    let codeExists = await db.user.findUnique({
      where: { uniqueUserCode },
    });
    while (codeExists) {
      uniqueUserCode = generateUserCode();
      codeExists = await db.user.findUnique({
        where: { uniqueUserCode },
      });
    }

    if (process.env.NODE_ENV === "production" && (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)) {
      return NextResponse.json({ error: "Email verification is not configured" }, { status: 503 });
    }

    const code = randomVerificationCode();
    const user = await db.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          emailCanonical: canonicalEmail,
          name: name || email.split("@")[0],
          password: await hashPassword(password),
          authProvider: "email",
          uniqueUserCode,
        },
      });
      await tx.appVerificationCode.create({
        data: {
          email: canonicalEmail,
          userId: created.id,
          codeHash: verificationHash(canonicalEmail, code),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
      return created;
    });
    await sendVerificationEmail(email, code);
    await recordAbuseEvent("register_created", signals.deviceHash, user.id);
    return NextResponse.json({
      email,
      requiresVerification: true,
      ...(process.env.NODE_ENV !== "production" ? { devCode: code } : {}),
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already registered. Please sign in." },
        { status: 409 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
