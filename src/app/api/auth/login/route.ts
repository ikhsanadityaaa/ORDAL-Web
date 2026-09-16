import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyPassword,
  hashPassword,
  createSession,
  getUserAccessStatus,
} from "@/lib/auth";
import {
  canonicalizeEmail,
  emailSignal,
  guardLogin,
  recordAbuseEvent,
  requestSignals,
} from "@/lib/abuse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    const signals = requestSignals(req, "");
    const loginEmailHash = emailSignal(email);
    try {
      await guardLogin(signals.ipHash, loginEmailHash);
    } catch {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }
    if (password.length > 100) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Find user
    const user = await db.user.findFirst({
      where: { OR: [{ email }, { emailCanonical: canonicalizeEmail(email) }] },
    });

    if (!user || !user.password) {
      await Promise.all([
        recordAbuseEvent("login_failed", signals.ipHash, undefined, "ip"),
        recordAbuseEvent("login_failed", loginEmailHash, undefined, "email"),
      ]);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordCheck = await verifyPassword(password, user.password);
    if (!passwordCheck.valid) {
      await Promise.all([
        recordAbuseEvent("login_failed", signals.ipHash, user.id, "ip"),
        recordAbuseEvent("login_failed", loginEmailHash, user.id, "email"),
      ]);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (passwordCheck.needsUpgrade) {
      await db.user.update({
        where: { id: user.id },
        data: { password: await hashPassword(password) },
      });
    }

    // Create session
    const session = await createSession(user.id);
    await recordAbuseEvent("login_success", loginEmailHash, user.id);

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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
