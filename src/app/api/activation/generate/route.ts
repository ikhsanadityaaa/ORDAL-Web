import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromSession, generateActivationCode } from "@/lib/auth";

/*
 * POST /api/activation/generate
 *
 * Called by the ORDAL desktop app right after the user completes a payment
 * INSIDE the app. Requires the user's web session (they registered on the
 * website with Google or email). Generates the user's personal activation
 * code and stores it on their user record — the same place their login
 * data lives. Idempotent: if the user already has a code, it is returned
 * as-is (never regenerated, never rotated).
 */
export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("ordal-session")?.value;
    const user = sessionToken ? await getUserFromSession(sessionToken) : null;

    if (!user) {
      return NextResponse.json(
        { success: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    // Already has an activation code? Return it — one code per user, forever.
    if (user.activationCode) {
      return NextResponse.json({
        success: true,
        activationCode: user.activationCode,
        createdAt: user.createdAt,
        alreadyIssued: true,
      });
    }

    // Issue a new unique code (retry on the unlikely collision)
    let activationCode = generateActivationCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await db.user.findUnique({
        where: { activationCode },
        select: { id: true },
      });
      if (!existing) break;
      activationCode = generateActivationCode();
    }

    await db.user.update({
      where: { id: user.id },
      data: { activationCode },
    });

    return NextResponse.json({
      success: true,
      activationCode,
      alreadyIssued: false,
    });
  } catch (error) {
    console.error("Activation generate error:", error);
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    );
  }
}
