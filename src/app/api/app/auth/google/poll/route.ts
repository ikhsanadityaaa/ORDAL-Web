import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appError } from "@/lib/app-route";
import { AppApiError, deviceFromBody, deviceKey, getAccessStatus, issueAppSession, listDevices, registerDevice, userPayload } from "@/lib/app-api";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Record<string, unknown>;
    const state = typeof body.state === "string" ? body.state : "";
    const attempt = state ? await db.appOAuthAttempt.findUnique({ where: { state }, include: { user: true } }) : null;
    if (!attempt || attempt.expiresAt <= new Date()) throw new AppApiError(400, "OAUTH_EXPIRED", "Login Google sudah kedaluwarsa");
    if (attempt.status === "pending") return NextResponse.json({ status: "pending" });
    if (attempt.status !== "completed" || !attempt.user) throw new AppApiError(400, "OAUTH_FAILED", "Login Google gagal");
    const input = deviceFromBody(body);
    if (deviceKey(input.fingerprint) !== attempt.deviceKey) throw new AppApiError(400, "INVALID_DEVICE", "Identitas device berubah");
    const device = await registerDevice(attempt.user.id, input);
    const token = await issueAppSession(attempt.user.id, device.id);
    await db.appOAuthAttempt.delete({ where: { state } });
    return NextResponse.json({
      status: "completed",
      token,
      user: userPayload(attempt.user),
      devices: await listDevices(attempt.user.id, device.id),
      onboarding: { completed: false, current_step: 1 },
      license: await getAccessStatus(attempt.user.id, device.deviceKey),
    });
  } catch (error) {
    if (error instanceof AppApiError && error.code === "DEVICE_LIMIT") {
      return NextResponse.json({ status: "device_limit", ...error.extra });
    }
    return appError(error);
  }
}
