import { NextResponse } from "next/server";
import { appError } from "@/lib/app-route";
import { authenticateAppRequest, getAccessStatus } from "@/lib/app-api";

export async function GET(req: Request) {
  try {
    const session = await authenticateAppRequest(req);
    return NextResponse.json({
      ...await getAccessStatus(session.userId, session.device.deviceKey),
      pricing: { idr: 159000, usd: 10 },
      payments_simulated: false,
    });
  } catch (error) {
    return appError(error);
  }
}
