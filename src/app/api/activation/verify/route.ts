import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/*
 * POST /api/activation/verify
 *
 * Called by the ORDAL desktop app to validate an activation code.
 * Body: { "code": "ORD-XXXX-XXXX-XXXX" }
 * Returns validity plus a masked email so the user can confirm the code
 * belongs to their account without exposing anyone's data.
 */
function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!domain) return "***";
  const visible = name.slice(0, 1);
  return `${visible}${"•".repeat(Math.max(2, name.length - 1))}@${domain}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const code =
      typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "missing_code" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { activationCode: code },
      select: { id: true, email: true, uniqueUserCode: true },
    });

    if (!user) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({
      valid: true,
      email: maskEmail(user.email),
      userCode: user.uniqueUserCode,
    });
  } catch (error) {
    console.error("Activation verify error:", error);
    return NextResponse.json(
      { valid: false, error: "server_error" },
      { status: 500 }
    );
  }
}
