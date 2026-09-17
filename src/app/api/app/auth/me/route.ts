import { NextResponse } from "next/server";
import { appError } from "@/lib/app-route";
import { authenticateAppRequest, getAccessStatus, listDevices, userPayload } from "@/lib/app-api";

export async function GET(req: Request) {
  try {
    const session = await authenticateAppRequest(req);
    return NextResponse.json({
      user: userPayload(session.user),
      devices: await listDevices(session.userId, session.deviceId),
      onboarding: { completed: false, current_step: 1 },
      license: await getAccessStatus(session.userId, session.device.deviceKey),
      google_configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      smtp_configured: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
    });
  } catch (error) {
    return appError(error);
  }
}
