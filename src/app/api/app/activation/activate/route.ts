import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appError } from "@/lib/app-route";
import { AppApiError, authenticateAppRequest } from "@/lib/app-api";

export async function POST(req: Request) {
  try {
    const session = await authenticateAppRequest(req);
    const body = await req.json() as { code?: string };
    const code = body.code?.trim().toUpperCase() || "";
    const grant = await db.licenseGrant.findFirst({ where: { userId: session.userId, code } });
    const legacy = session.user.activationCode === code;
    if (!grant && !legacy) throw new AppApiError(400, "INVALID_CODE", "Kode aktivasi tidak valid untuk akun ini");
    return NextResponse.json({ activated: true });
  } catch (error) {
    return appError(error);
  }
}
