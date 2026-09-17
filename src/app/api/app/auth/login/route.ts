import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canonicalizeEmail, emailSignal, guardLogin, recordAbuseEvent, requestSignals } from "@/lib/abuse";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { appError } from "@/lib/app-route";
import { deviceFromBody, getAccessStatus, issueAppSession, listDevices, registerDevice, userPayload } from "@/lib/app-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const device = deviceFromBody(body);
    if (!email || !password || password.length > 100) {
      return NextResponse.json({ detail: "Email atau password salah" }, { status: 401 });
    }
    const signals = requestSignals(req, device.fingerprint);
    const emailHash = emailSignal(email);
    await guardLogin(signals.ipHash, emailHash);
    const user = await db.user.findFirst({
      where: { OR: [{ email }, { emailCanonical: canonicalizeEmail(email) }] },
    });
    const check = user?.password ? await verifyPassword(password, user.password) : { valid: false, needsUpgrade: false };
    if (!user || !check.valid) {
      await Promise.all([
        recordAbuseEvent("login_failed", signals.ipHash, user?.id, "ip"),
        recordAbuseEvent("login_failed", emailHash, user?.id, "email"),
      ]);
      return NextResponse.json({ detail: "Email atau password salah" }, { status: 401 });
    }
    if (!user.emailVerifiedAt) {
      return NextResponse.json({ email: user.email, requires_verification: true }, { status: 200 });
    }
    if (check.needsUpgrade) {
      await db.user.update({ where: { id: user.id }, data: { password: await hashPassword(password) } });
    }
    const registered = await registerDevice(user.id, device);
    const token = await issueAppSession(user.id, registered.id);
    await recordAbuseEvent("login_success", emailHash, user.id);
    return NextResponse.json({
      token,
      user: userPayload(user),
      devices: await listDevices(user.id, registered.id),
      onboarding: { completed: false, current_step: 1 },
      license: await getAccessStatus(user.id, registered.deviceKey),
      google_configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      smtp_configured: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "LOGIN_RATE_LIMIT") {
      return NextResponse.json(
        { detail: { code: "LOGIN_RATE_LIMIT", message: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit" } },
        { status: 429 },
      );
    }
    return appError(error);
  }
}
