import { db } from "@/lib/db";
import { createHash, randomBytes } from "crypto";

// Generate unique user code (ORD-USER-XXXXXX)
export function generateUserCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
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
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return s;
  };
  return `ORD-${segment()}-${segment()}-${segment()}`;
}

// Generate session token
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

// Hash password (simple SHA-256 for demo, use bcrypt in production)
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
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

// Start trial for new user
export async function startTrial(userId: string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

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
  const trial = await db.trial.findUnique({
    where: { userId },
  });

  if (!trial) return null;

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
