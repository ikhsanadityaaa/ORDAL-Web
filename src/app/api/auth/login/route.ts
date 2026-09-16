import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyPassword,
  hashPassword,
  createSession,
  getUserAccessStatus,
} from "@/lib/auth";

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
    if (password.length > 100) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordCheck = await verifyPassword(password, user.password);
    if (!passwordCheck.valid) {
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
