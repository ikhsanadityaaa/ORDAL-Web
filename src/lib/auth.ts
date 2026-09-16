import { db } from "@/lib/db";
import { randomBytes, randomInt } from "crypto";
export { hashPassword, verifyPassword } from "@/lib/password";

const TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000;

// Generate unique user code (ORD-USER-XXXXXX)
export function generateUserCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(randomInt(chars.length));
  }
  return `ORD-USER-${code}`;
}

// Generate activation code (ORD-XXXX-XXXX-XXXX)
// Issued when the user pays INSIDE the app; stored on the user record.
export function generateActivationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segment = () => {
    let s = "";
    for (let i = 0; i < 4; i++) {
      s += chars.charAt(randomInt(chars.length));
    }
    return s;
  };
  return `ORD-${segment()}-${segment()}-${segment()}`;
}

// Generate session token
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

// Create a session for user
export async function createSession(userId: string) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

// Get user from session token
export async function getUserFromSession(token: string) {
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          trial: true,
        },
      },
    },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    // Session expired, delete it
    await db.session.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}

// Trial starts from the desktop app when Find Jobs is used for the first time.
export async function startTrial(userId: string) {
  const expiresAt = new Date(Date.now() + TRIAL_DURATION_MS);

  const trial = await db.trial.create({
    data: {
      userId,
      expiresAt,
      status: "active",
    },
  });

  return trial;
}

// Check trial status
export async function checkTrialStatus(userId: string) {
  let trial = await db.trial.findUnique({
    where: { userId },
  });

  if (!trial) return null;

  // Extend shorter legacy trials without restarting their original clock.
  const threeDayExpiry = new Date(trial.startedAt.getTime() + TRIAL_DURATION_MS);
  if (trial.expiresAt < threeDayExpiry) {
    trial = await db.trial.update({
      where: { id: trial.id },
      data: {
        expiresAt: threeDayExpiry,
        status: threeDayExpiry > new Date() ? "active" : "expired",
      },
    });
  }

  // Check if expired
  if (trial.status === "active" && trial.expiresAt < new Date()) {
    await db.trial.update({
      where: { id: trial.id },
      data: { status: "expired" },
    });
    return { ...trial, status: "expired" };
  }

  return trial;
}

// Get user access status (trial active or activation code present)
export async function getUserAccessStatus(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { activationCode: true },
  });
  const activationCode = user?.activationCode ?? null;
  const trial = await checkTrialStatus(userId);

  return {
    hasActivationCode: !!activationCode,
    activationCode,
    trial: trial
      ? {
          status: trial.status,
          expiresAt: trial.expiresAt,
          timeRemaining:
            trial.status === "active"
              ? Math.max(0, trial.expiresAt.getTime() - Date.now())
              : 0,
        }
      : null,
    access:
      !!activationCode || (trial && trial.status === "active")
        ? "granted"
        : "required",
  };
}
