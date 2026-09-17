import { NextResponse } from "next/server";
import { appError } from "@/lib/app-route";
import { AppApiError, authenticateAppRequest, hasPermanentAccess, sendVerificationEmail } from "@/lib/app-api";

export async function POST(req: Request) {
  try {
    const session = await authenticateAppRequest(req);
    const access = await hasPermanentAccess(session.userId);
    const code = access?.grant?.code || access?.user.activationCode;
    if (!code) throw new AppApiError(404, "LICENSE_NOT_FOUND", "Kode lisensi belum tersedia");
    await sendVerificationEmail(session.user.email, code, "license");
    return NextResponse.json({ sent: true });
  } catch (error) {
    return appError(error);
  }
}
