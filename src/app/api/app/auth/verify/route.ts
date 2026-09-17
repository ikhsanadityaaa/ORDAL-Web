import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canonicalizeEmail } from "@/lib/abuse";
import { appError } from "@/lib/app-route";
import { deviceFromBody, getAccessStatus, issueAppSession, listDevices, registerDevice, safeEqual, userPayload, verificationHash } from "@/lib/app-api";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Record<string, unknown>;
    const email = typeof body.email === "string" ? canonicalizeEmail(body.email) : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    if (!email || !/^\d{6}$/.test(code)) return NextResponse.json({ detail: "Kode tidak valid" }, { status: 400 });
    const record = await db.appVerificationCode.findFirst({
      where: { email, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (!record || record.attempts >= 5 || !safeEqual(record.codeHash, verificationHash(email, code))) {
      if (record) await db.appVerificationCode.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
      return NextResponse.json({ detail: "Kode salah atau kedaluwarsa" }, { status: 400 });
    }
    const user = await db.user.update({
      where: { id: record.userId || "" },
      data: { emailVerifiedAt: new Date() },
    });
    const device = await registerDevice(user.id, deviceFromBody(body));
    const token = await issueAppSession(user.id, device.id);
    await db.appVerificationCode.deleteMany({ where: { email } });
    return NextResponse.json({
      token,
      user: userPayload(user),
      devices: await listDevices(user.id, device.id),
      onboarding: { completed: false, current_step: 1 },
      license: await getAccessStatus(user.id, device.deviceKey),
    });
  } catch (error) {
    return appError(error);
  }
}
