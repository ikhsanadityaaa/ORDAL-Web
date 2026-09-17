import { NextResponse } from "next/server";
import { appError } from "@/lib/app-route";
import { authenticateAppRequest, hasPermanentAccess, maskCode } from "@/lib/app-api";

export async function GET(req: Request) {
  try {
    const session = await authenticateAppRequest(req);
    const access = await hasPermanentAccess(session.userId);
    const code = access?.grant?.code || access?.user.activationCode || null;
    return NextResponse.json({ has_code: Boolean(code), code_masked: code ? maskCode(code) : null, email: session.user.email });
  } catch (error) {
    return appError(error);
  }
}
