import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = req.cookies.get("ordal-session")?.value;

    if (!sessionToken) {
      // Allow anonymous download tracking
      const body = await req.json();
      const { platform } = body;

      if (!platform || !["windows", "macos"].includes(platform)) {
        return NextResponse.json(
          { error: "Invalid platform" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Download tracked (anonymous)",
        platform,
      });
    }

    // Get user from session
    const user = await getUserFromSession(sessionToken);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { platform } = body;

    // Validate platform
    if (!platform || !["windows", "macos"].includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform" },
        { status: 400 }
      );
    }

    // Record download
    await db.download.create({
      data: {
        userId: user.id,
        platform,
        appVersion: "1.0.0",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Download tracked",
      platform,
      version: "1.0.0",
    });
  } catch (error) {
    console.error("Download track error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
