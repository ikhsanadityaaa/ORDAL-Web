import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canonicalizeEmail } from "@/lib/abuse";
import { verifyPassword } from "@/lib/auth";
import { appError } from "@/lib/app-route";
import { listDevices } from "@/lib/app-api";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Record<string, unknown>;
    const email = typeof body.email === "string" ? canonicalizeEmail(body.email) : "";
    const password = typeof body.password === "string" ? body.password : "";
    const deviceId = typeof body.device_id === "string" ? body.device_id : "";
    const user = await db.user.findFirst({ where: { OR: [{ email }, { emailCanonical: email }] } });
    const passwordOk = user?.password ? await verifyPassword(password, user.password) : { valid: false };
    if (!user || !passwordOk.valid) return NextResponse.json({ detail: "Email atau password salah" }, { status: 401 });
    await db.secureDevice.deleteMany({ where: { id: deviceId, userId: user.id } });
    return NextResponse.json({ ok: true, devices: await listDevices(user.id) });
  } catch (error) {
    return appError(error);
  }
}
