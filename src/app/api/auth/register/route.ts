import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  generateUserCode,
  hashPassword,
  createSession,
  getUserAccessStatus,
} from "@/lib/auth";
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
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
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

    // Create user
    const user = await db.user.create({
      data: {
        email,
        emailCanonical: canonicalEmail,
        name: name || email.split("@")[0],
        password: await hashPassword(password),
        authProvider: "email",
        uniqueUserCode,
      },
    });

    // Create session
    const session = await createSession(user.id);
    await recordAbuseEvent("register_created", signals.deviceHash, user.id);

    // Get access status
    const access = await getUserAccessStatus(user.id);

    // Create response
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

    // Set session cookie
    response.cookies.set("ordal-session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
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
