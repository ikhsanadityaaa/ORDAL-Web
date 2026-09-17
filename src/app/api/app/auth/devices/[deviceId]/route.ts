import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appError } from "@/lib/app-route";
import { AppApiError, authenticateAppRequest, listDevices } from "@/lib/app-api";

export async function DELETE(req: Request, context: { params: Promise<{ deviceId: string }> }) {
  try {
    const session = await authenticateAppRequest(req);
    const { deviceId } = await context.params;
    if (deviceId === session.deviceId) throw new AppApiError(400, "CURRENT_DEVICE", "Device aktif tidak dapat dikeluarkan");
    const result = await db.secureDevice.deleteMany({ where: { id: deviceId, userId: session.userId } });
    if (!result.count) throw new AppApiError(404, "DEVICE_NOT_FOUND", "Device tidak ditemukan");
    return NextResponse.json({ devices: await listDevices(session.userId, session.deviceId) });
  } catch (error) {
    return appError(error);
  }
}
