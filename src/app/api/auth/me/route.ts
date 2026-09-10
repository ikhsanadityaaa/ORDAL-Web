import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession, getUserAccessStatus } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = req.cookies.get("ordal-session")?.value;

    if (!sessionToken) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        trial: null,
        access: "required",
      });
    }

    // Get user from session
    const user = await getUserFromSession(sessionToken);

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        trial: null,
        access: "required",
      });
    }

    // Get access status (trial + activation code)
    const access = await getUserAccessStatus(user.id);

    return NextResponse.json({
      authenticated: true,
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
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        trial: null,
        access: "required",
      },
      { status: 500 }
    );
  }
}
