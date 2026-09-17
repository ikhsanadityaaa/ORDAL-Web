import { createHash, createHmac, randomBytes, randomInt, randomUUID, timingSafeEqual } from "crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { generateActivationCode } from "@/lib/auth";
import { canonicalizeEmail } from "@/lib/abuse";

export const MAX_DEVICES = 2;
export const TRIAL_MS = 3 * 24 * 60 * 60 * 1000;
const APP_SESSION_MS = 30 * 24 * 60 * 60 * 1000;

export type DeviceInput = {
  fingerprint: string;
  name?: string;
  os?: string;
  appVersion?: string;
};

export class AppApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public extra: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

function secret(name: string): string {
  const value = process.env[name]?.trim();
  if (value) return value;
  if (process.env.NODE_ENV !== "production") return `ordal-dev-${name}`;
  throw new Error(`${name} is required in production`);
}

function keyedHash(kind: string, value: string): string {
  return createHmac("sha256", secret("DEVICE_HASH_PEPPER"))
    .update(`${kind}:${value}`)
    .digest("hex");
}

export function deviceKey(fingerprint: string): string {
  const value = fingerprint.trim().toLowerCase();
  if (!/^[a-z0-9_-]{32,128}$/.test(value)) {
    throw new AppApiError(400, "INVALID_DEVICE", "Identitas device tidak valid");
  }
  return keyedHash("device", value);
}

export function canonicalEmailKey(email: string): string {
  return keyedHash("email", canonicalizeEmail(email));
}

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function bearerToken(req: Request): string {
  const header = req.headers.get("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

export async function authenticateAppRequest(req: Request) {
  const token = bearerToken(req);
  if (!token) throw new AppApiError(401, "UNAUTHORIZED", "Silakan login lagi");

  const session = await db.appSession.findUnique({
    where: { tokenHash: tokenHash(token) },
    include: { user: true, device: true },
  });
  if (!session || session.expiresAt <= new Date()) {
    if (session) await db.appSession.delete({ where: { id: session.id } });
    throw new AppApiError(401, "UNAUTHORIZED", "Sesi sudah berakhir");
  }

  const stale = session.lastSeenAt.getTime() < Date.now() - 5 * 60 * 1000;
  if (stale) {
    await db.$transaction([
      db.appSession.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } }),
      db.secureDevice.update({ where: { id: session.deviceId }, data: { lastActiveAt: new Date() } }),
    ]);
  }
  return session;
}

export async function registerDevice(userId: string, input: DeviceInput) {
  const key = deviceKey(input.fingerprint);
  return db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}))`;
    const existing = await tx.secureDevice.findUnique({
      where: { userId_deviceKey: { userId, deviceKey: key } },
    });
    if (existing) {
      return tx.secureDevice.update({
        where: { id: existing.id },
        data: {
          name: input.name?.slice(0, 120) || existing.name,
          os: input.os?.slice(0, 160) || existing.os,
          appVersion: input.appVersion?.slice(0, 40) || existing.appVersion,
          lastLoginAt: new Date(),
          lastActiveAt: new Date(),
        },
      });
    }

    const devices = await tx.secureDevice.findMany({
      where: { userId },
      orderBy: { lastLoginAt: "desc" },
    });
    if (devices.length >= MAX_DEVICES) {
      throw new AppApiError(403, "DEVICE_LIMIT", `Batas ${MAX_DEVICES} device tercapai`, {
        devices: devices.map((device) => serializeDevice(device)),
      });
    }
    return tx.secureDevice.create({
      data: {
        userId,
        deviceKey: key,
        name: input.name?.slice(0, 120) || "Device",
        os: input.os?.slice(0, 160) || "",
        appVersion: input.appVersion?.slice(0, 40) || "",
      },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
}

export async function issueAppSession(userId: string, deviceId: string) {
  const token = randomBytes(32).toString("base64url");
  await db.appSession.create({
    data: {
      userId,
      deviceId,
      tokenHash: tokenHash(token),
      expiresAt: new Date(Date.now() + APP_SESSION_MS),
    },
  });
  return token;
}

export function serializeDevice(device: {
  id: string;
  name: string;
  os: string;
  appVersion: string;
  lastLoginAt: Date;
  lastActiveAt: Date;
  createdAt: Date;
}, currentId?: string) {
  return {
    id: device.id,
    device_id: device.id,
    device_name: device.name,
    os: device.os,
    app_version: device.appVersion,
    last_login_at: device.lastLoginAt.toISOString(),
    last_active_at: device.lastActiveAt.toISOString(),
    created_at: device.createdAt.toISOString(),
    is_current: device.id === currentId,
  };
}

export async function listDevices(userId: string, currentId?: string) {
  const devices = await db.secureDevice.findMany({
    where: { userId },
    orderBy: { lastLoginAt: "desc" },
  });
  return devices.map((device) => serializeDevice(device, currentId));
}

function complimentaryEmails(): Set<string> {
  return new Set(
    (process.env.COMPLIMENTARY_EMAILS || "")
      .split(",")
      .map((email) => canonicalizeEmail(email))
      .filter(Boolean),
  );
}

export async function hasPermanentAccess(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      activationCode: true,
      complimentaryAccess: true,
      licenseGrant: true,
    },
  });
  if (!user) return null;
  const grant = user.licenseGrant;
  const grantActive = !!grant && (!grant.expiresAt || grant.expiresAt > new Date());
  return {
    allowed:
      user.complimentaryAccess ||
      complimentaryEmails().has(canonicalizeEmail(user.email)) ||
      !!user.activationCode ||
      grantActive,
    user,
    grant: grantActive ? grant : null,
  };
}

export async function getAccessStatus(userId: string, key?: string) {
  const permanent = await hasPermanentAccess(userId);
  if (!permanent) throw new AppApiError(404, "USER_NOT_FOUND", "Akun tidak ditemukan");

  const trial = await db.trial.findUnique({ where: { userId } });
  if (permanent.allowed) {
    return {
      activated: true,
      license: permanent.grant
        ? {
            code: permanent.grant.code,
            code_masked: maskCode(permanent.grant.code),
            method: permanent.grant.method,
            activated_at: permanent.grant.activatedAt.toISOString(),
            expires_at: permanent.grant.expiresAt?.toISOString() || null,
          }
        : null,
      trial: serializeTrial(trial),
      access: { allowed: true, reason: permanent.user.complimentaryAccess ? "complimentary" : "activated" },
    };
  }

  if (key) {
    const claim = await db.trialDeviceClaim.findUnique({ where: { deviceKey: key } });
    if (claim && claim.userId !== userId) {
      return {
        activated: false,
        license: null,
        trial: serializeTrial(trial),
        access: { allowed: false, reason: "trial_not_eligible" },
      };
    }
  }

  if (!trial) {
    return {
      activated: false,
      license: null,
      trial: { started: false, status: "not_started" },
      access: { allowed: true, reason: "not_started" },
    };
  }
  const active = trial.expiresAt > new Date();
  if (!active && trial.status !== "expired") {
    await db.trial.update({ where: { id: trial.id }, data: { status: "expired" } });
  }
  return {
    activated: false,
    license: null,
    trial: serializeTrial({ ...trial, status: active ? "active" : "expired" }),
    access: { allowed: active, reason: active ? "trial_active" : "trial_expired" },
  };
}

export async function startTrial(userId: string, email: string, key: string) {
  const permanent = await hasPermanentAccess(userId);
  if (permanent?.allowed) return { status: await getAccessStatus(userId, key), justStarted: false };

  let justStarted = false;
  const emailKey = canonicalEmailKey(email);
  await db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${key}))`;
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${emailKey}))`;
    const claim = await tx.trialDeviceClaim.findUnique({ where: { deviceKey: key } });
    if (claim && claim.userId !== userId) {
      throw new AppApiError(403, "TRIAL_NOT_ELIGIBLE", "Trial perangkat ini sudah pernah dipakai");
    }
    if (!claim) await tx.trialDeviceClaim.create({ data: { deviceKey: key, userId } });

    const emailClaim = await tx.abuseEvent.findFirst({
      where: { eventType: "trial_email_claim", subjectHash: emailKey },
    });
    if (emailClaim && emailClaim.userId !== userId) {
      throw new AppApiError(403, "TRIAL_NOT_ELIGIBLE", "Identitas email ini sudah pernah memakai trial");
    }
    if (!emailClaim) {
      await tx.abuseEvent.create({
        data: { eventType: "trial_email_claim", subjectHash: emailKey, userId },
      });
    }

    const trial = await tx.trial.findUnique({ where: { userId } });
    if (!trial) {
      const now = new Date();
      await tx.trial.create({
        data: { userId, startedAt: now, expiresAt: new Date(now.getTime() + TRIAL_MS), status: "active" },
      });
      justStarted = true;
    }
  });

  return { status: await getAccessStatus(userId, key), justStarted };
}

export async function ensureLicense(userId: string, method: string, paymentId?: string | null) {
  const existing = await db.licenseGrant.findUnique({ where: { userId } });
  if (existing) return existing;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateActivationCode();
    try {
      const grant = await db.$transaction(async (tx) => {
        const created = await tx.licenseGrant.create({
          data: { id: randomUUID(), userId, code, method, paymentId },
        });
        await tx.user.update({ where: { id: userId }, data: { activationCode: code } });
        return created;
      });
      return grant;
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) throw error;
      const concurrent = await db.licenseGrant.findUnique({ where: { userId } });
      if (concurrent) return concurrent;
    }
  }
  throw new Error("Unable to issue unique license code");
}

export function serializeTrial(trial: { startedAt: Date; expiresAt: Date; status: string } | null) {
  if (!trial) return { started: false, status: "not_started" };
  const remaining = Math.max(0, Math.floor((trial.expiresAt.getTime() - Date.now()) / 1000));
  return {
    started: true,
    started_at: trial.startedAt.toISOString(),
    expires_at: trial.expiresAt.toISOString(),
    remaining_seconds: remaining,
    status: remaining > 0 ? "active" : "expired",
  };
}

export function maskCode(code: string) {
  const parts = code.split("-");
  return parts.length === 4 ? `${parts[0]}-****-****-${parts[3]}` : "********";
}

export function userPayload(user: {
  id: string;
  email: string;
  name: string;
  uniqueUserCode: string;
  authProvider: string;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    uniqueUserCode: user.uniqueUserCode,
    authProvider: user.authProvider,
    emailVerified: !!user.emailVerifiedAt,
    createdAt: user.createdAt.toISOString(),
  };
}

export function randomVerificationCode(): string {
  return randomInt(100000, 1000000).toString();
}

export function verificationHash(email: string, code: string): string {
  return createHmac("sha256", secret("EMAIL_CODE_SECRET"))
    .update(`${canonicalizeEmail(email)}:${code}`)
    .digest("hex");
}

export function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function sendVerificationEmail(email: string, code: string, purpose: "verification" | "license" = "verification") {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") throw new AppApiError(503, "EMAIL_NOT_CONFIGURED", "Email verifikasi belum dikonfigurasi");
    return false;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: purpose === "license" ? "Kode lisensi ORDAL" : "Kode verifikasi ORDAL",
      text: purpose === "license"
        ? `Kode lisensi ORDAL Anda: ${code}. Simpan kode ini untuk akun Anda.`
        : `Kode verifikasi ORDAL Anda: ${code}. Kode berlaku 15 menit.`,
    }),
  });
  if (!response.ok) throw new AppApiError(502, "EMAIL_SEND_FAILED", "Email verifikasi gagal dikirim");
  return true;
}

export function deviceFromBody(body: Record<string, unknown>): DeviceInput {
  return {
    fingerprint: typeof body.device_fingerprint === "string" ? body.device_fingerprint : "",
    name: typeof body.device_name === "string" ? body.device_name : "",
    os: typeof body.os === "string" ? body.os : "",
    appVersion: typeof body.app_version === "string" ? body.app_version : "",
  };
}
