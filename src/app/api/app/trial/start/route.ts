import { NextResponse } from "next/server";
import { appError } from "@/lib/app-route";
import { AppApiError, authenticateAppRequest, startTrial } from "@/lib/app-api";

export async function POST(req: Request) {
  try {
    const session = await authenticateAppRequest(req);
    const result = await startTrial(session.userId, session.user.email, session.device.deviceKey);
    if (!result.status.access.allowed) {
      const code = result.status.access.reason === "trial_not_eligible" ? "TRIAL_NOT_ELIGIBLE" : "TRIAL_EXPIRED";
      throw new AppApiError(403, code, "Akses trial tidak tersedia", { status: result.status });
    }
    return NextResponse.json({ ...result.status, just_started: result.justStarted });
  } catch (error) {
    return appError(error);
  }
}
