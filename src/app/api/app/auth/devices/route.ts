import { NextResponse } from "next/server";
import { appError } from "@/lib/app-route";
import { authenticateAppRequest, listDevices } from "@/lib/app-api";

export async function GET(req: Request) {
  try {
    const session = await authenticateAppRequest(req);
    return NextResponse.json({ devices: await listDevices(session.userId, session.deviceId) });
  } catch (error) {
    return appError(error);
  }
}
