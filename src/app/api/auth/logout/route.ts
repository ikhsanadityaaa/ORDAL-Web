import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = req.cookies.get("ordal-session")?.value;

    if (sessionToken) {
      // Delete session from database
      await db.session.deleteMany({
        where: { token: sessionToken },
      });
    }

    // Create response
    const response = NextResponse.json({ success: true });

    // Clear session cookie
    response.cookies.set("ordal-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
