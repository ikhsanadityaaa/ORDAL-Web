import { createHmac } from "crypto";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "guerrillamail.com",
  "maildrop.cc",
  "mailinator.com",
  "temp-mail.org",
  "tempmail.com",
  "yopmail.com",
]);
let nextCleanupAt = 0;

export async function maybeCleanupExpiredAppData() {
  const now = Date.now();
  if (now < nextCleanupAt) return;
  nextCleanupAt = now + 15 * 60 * 1000;
  try {
    await db.$transaction([
      db.appSession.deleteMany({ where: { expiresAt: { lt: new Date(now) } } }),
      db.appOAuthAttempt.deleteMany({ where: { expiresAt: { lt: new Date(now) } } }),
      db.appVerificationCode.deleteMany({ where: { expiresAt: { lt: new Date(now) } } }),
      db.abuseEvent.deleteMany({
        where: {
          createdAt: { lt: new Date(now - 30 * 24 * 60 * 60 * 1000) },
          NOT: { eventType: "trial_email_claim" },
        },
      }),
    ]);
  } catch (error) {
    console.error("App data cleanup failed:", error);
  }
}

export function canonicalizeEmail(email: string): string {
  const value = email.trim().toLowerCase();
  const at = value.lastIndexOf("@");
  if (at < 1) return value;
  let local = value.slice(0, at).split("+", 1)[0];
  let domain = value.slice(at + 1);
  if (domain === "gmail.com" || domain === "googlemail.com") {
    local = local.replaceAll(".", "");
    domain = "gmail.com";
  }
  return `${local}@${domain}`;
}

export function assertEmailAllowed(email: string): void {
  const domain = canonicalizeEmail(email).split("@")[1] || "";
  const configured = new Set(
    (process.env.BLOCKED_EMAIL_DOMAINS || "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
  );
  if (DISPOSABLE_DOMAINS.has(domain) || configured.has(domain)) {
    throw new Error("DISPOSABLE_EMAIL");
  }
}

function signal(value: string): string {
  const secret = process.env.ABUSE_HASH_SECRET || "ordal-development-only";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function requestSignals(req: NextRequest, deviceId: string) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = req.headers.get("x-real-ip") || forwarded || "unknown";
  return {
    ipHash: signal(`ip:${ip}`),
    deviceHash: signal(`device:${deviceId || "missing"}`),
  };
}

export function emailSignal(email: string) {
  return signal(`email:${canonicalizeEmail(email)}`);
}

export async function guardRegistration(ipHash: string, deviceHash: string) {
  await maybeCleanupExpiredAppData();
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [ipAttempts, deviceAttempts] = await Promise.all([
    db.abuseEvent.count({
      where: { eventType: "register_attempt", subjectHash: ipHash, createdAt: { gt: hourAgo } },
    }),
    db.abuseEvent.count({
      where: { eventType: "register_attempt", subjectHash: deviceHash, createdAt: { gt: dayAgo } },
    }),
  ]);
  if (ipAttempts >= 10 || deviceAttempts >= 5) {
    throw new Error("REGISTER_RATE_LIMIT");
  }
}

export async function guardLogin(ipHash: string, emailHash: string) {
  await maybeCleanupExpiredAppData();
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const [ipAttempts, emailAttempts] = await Promise.all([
    db.abuseEvent.count({
      where: { eventType: "login_failed", subjectHash: ipHash, createdAt: { gt: fifteenMinutesAgo } },
    }),
    db.abuseEvent.count({
      where: { eventType: "login_failed", subjectHash: emailHash, createdAt: { gt: fifteenMinutesAgo } },
    }),
  ]);
  if (ipAttempts >= 20 || emailAttempts >= 8) {
    throw new Error("LOGIN_RATE_LIMIT");
  }
}

export async function recordAbuseEvent(
  eventType: string,
  subjectHash: string,
  userId?: string,
  detail = ""
) {
  await db.abuseEvent.create({
    data: { eventType, subjectHash, userId, detail: detail.slice(0, 500) },
  });
}
