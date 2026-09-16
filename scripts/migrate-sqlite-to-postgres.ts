/**
 * OPTIONAL one-off utility: copy data from the legacy SQLite database
 * (db/custom.db — the pre-migration runtime DB) into PostgreSQL.
 *
 * Context: the SQLite → PostgreSQL migration (Task 12) started the
 * production database FRESH because the legacy file contained only
 * local E2E test accounts (adit@test.com, seo-test@ordal.app, …) —
 * zero production users. Run this script ONLY if you need to recover
 * legacy records, e.g. a real user was created before the migration.
 *
 * Usage (against the target PostgreSQL — e.g. Supabase direct URL):
 *   POSTGRES_PRISMA_URL='postgresql://…' POSTGRES_URL_NON_POOLING='postgresql://…' \
 *     bun run db:migrate-legacy
 * (Without inline env vars, Bun auto-loads .env from the project root.)
 *
 * Behaviour:
 *   - Users are matched by email. New emails are inserted with their
 *     legacy ids (preserves FK relations). Existing emails are NEVER
 *     overwritten — only a missing activationCode is backfilled from
 *     the legacy record, then that account is reported as "skipped".
 *   - Trials/Sessions/Downloads follow the user-id mapping. Expired
 *     sessions are dropped (pointless to migrate).
 *   - Idempotent: safe to re-run; already-copied rows are skipped.
 *
 * The legacy SQLite file is only READ (readonly connection). Nothing
 * deletes it — keep it until the PostgreSQL deployment is verified.
 */
import { Database } from "bun:sqlite";
import { PrismaClient } from "@prisma/client";
import { existsSync, readFileSync } from "fs";
import path from "path";

const SQLITE_PATH = path.join(process.cwd(), "db", "custom.db");

/* ---------- env resolution ---------- */

/** Read a key from the project's .env (simple parser, no comments). */
function envFromFile(key: string): string | undefined {
  try {
    const content = readFileSync(path.join(process.cwd(), ".env"), "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(
        /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/
      );
      if (m && m[1] === key && m[2]) return m[2];
    }
  } catch {
    // .env may not exist — that's fine
  }
  return undefined;
}

const isPostgresUrl = (u: string | undefined) =>
  !!u && /^(postgres|postgresql):\/\//.test(u);

// Bun auto-loads .env, but a stale POSTGRES_PRISMA_URL inherited from a
// parent shell (e.g. the old SQLite `file:…` URL) takes priority.
// When the inherited value is not a PostgreSQL URL, fall back to the
// .env value before the Prisma client is constructed.
if (!isPostgresUrl(process.env.POSTGRES_PRISMA_URL)) {
  const fromFile = envFromFile("POSTGRES_PRISMA_URL");
  if (isPostgresUrl(fromFile)) {
    console.log(
      `[migrate-legacy] inherited POSTGRES_PRISMA_URL is not postgresql (${(
        process.env.POSTGRES_PRISMA_URL ?? "unset"
      ).split(":")[0]}://…) — using the PostgreSQL URL from .env instead`
    );
    process.env.POSTGRES_PRISMA_URL = fromFile;
    if (!isPostgresUrl(process.env.POSTGRES_URL_NON_POOLING)) {
      process.env.POSTGRES_URL_NON_POOLING =
        envFromFile("POSTGRES_URL_NON_POOLING") ?? fromFile;
    }
  }
}

const dbUrl = process.env.POSTGRES_PRISMA_URL ?? "";
if (!isPostgresUrl(dbUrl)) {
  const got = dbUrl ? `${dbUrl.split(":")[0]}://…` : "(unset)";
  console.error(
    `[migrate-legacy] POSTGRES_PRISMA_URL must be a PostgreSQL URL, got: ${got}.\n` +
      `The Prisma provider is postgresql. Example:\n` +
      `  POSTGRES_PRISMA_URL='postgresql://…' POSTGRES_URL_NON_POOLING='postgresql://…' bun run db:migrate-legacy`
  );
  process.exit(1);
}

if (!existsSync(SQLITE_PATH)) {
  console.error(`[migrate-legacy] legacy SQLite file not found: ${SQLITE_PATH}`);
  process.exit(1);
}

const sqlite = new Database(SQLITE_PATH, { readonly: true });
const prisma = new PrismaClient();

/* ---------- types (SQLite stores DateTime as epoch-ms INTEGER) ---------- */

type LegacyUser = {
  id: string;
  email: string;
  name: string;
  password: string | null;
  authProvider: string;
  uniqueUserCode: string;
  activationCode: string | null;
  createdAt: number;
  updatedAt: number;
};
type LegacyTrial = {
  id: string;
  userId: string;
  startedAt: number;
  expiresAt: number;
  status: string;
  createdAt: number;
  updatedAt: number;
};
type LegacySession = {
  id: string;
  userId: string;
  token: string;
  expiresAt: number;
  createdAt: number;
};
type LegacyDownload = {
  id: string;
  userId: string;
  appVersion: string;
  platform: string;
  downloadedAt: number;
};

const date = (ms: number) => new Date(Number(ms));

async function main() {
  console.log(`[migrate-legacy] source : ${SQLITE_PATH}`);
  console.log(`[migrate-legacy] target : PostgreSQL (${dbUrl.split("@").pop()})`);
  console.log("");

  /* ---------- Users (matched by email) ---------- */

  const legacyUsers = sqlite.query("SELECT * FROM User").all() as LegacyUser[];
  const userIdMap = new Map<string, string>(); // legacy id → PG id
  let usersCreated = 0;
  let usersSkipped = 0;
  let codesBackfilled = 0;

  for (const u of legacyUsers) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      // Never overwrite an account created on the new database; only
      // backfill an activation code the legacy record still has.
      if (!existing.activationCode && u.activationCode) {
        await prisma.user.update({
          where: { id: existing.id },
          data: { activationCode: u.activationCode },
        });
        codesBackfilled++;
        console.log(`  ↳ backfilled activation code for existing ${u.email}`);
      }
      userIdMap.set(u.id, existing.id);
      usersSkipped++;
      continue;
    }

    const created = await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        name: u.name,
        password: u.password,
        authProvider: u.authProvider,
        uniqueUserCode: u.uniqueUserCode,
        activationCode: u.activationCode,
        createdAt: date(u.createdAt),
        updatedAt: date(u.updatedAt),
      },
    });
    userIdMap.set(u.id, created.id);
    usersCreated++;
  }

  /* ---------- Trials (one per user, unique userId) ---------- */

  const legacyTrials = sqlite.query("SELECT * FROM Trial").all() as LegacyTrial[];
  let trialsCreated = 0;
  let trialsSkipped = 0;

  for (const t of legacyTrials) {
    const pgUserId = userIdMap.get(t.userId);
    if (!pgUserId) {
      trialsSkipped++;
      continue;
    }
    const existing = await prisma.trial.findUnique({ where: { userId: pgUserId } });
    if (existing) {
      trialsSkipped++;
      continue;
    }
    await prisma.trial.create({
      data: {
        // keep the legacy id when the user kept theirs; otherwise let
        // Prisma generate one (avoids collisions across remaps)
        ...(pgUserId === t.userId ? { id: t.id } : {}),
        userId: pgUserId,
        startedAt: date(t.startedAt),
        expiresAt: date(t.expiresAt),
        status: t.status,
        createdAt: date(t.createdAt),
        updatedAt: date(t.updatedAt),
      },
    });
    trialsCreated++;
  }

  /* ---------- Sessions (unique token; drop expired) ---------- */

  const legacySessions = sqlite.query("SELECT * FROM Session").all() as LegacySession[];
  let sessionsCreated = 0;
  let sessionsSkipped = 0;
  let sessionsExpired = 0;
  const now = Date.now();

  for (const s of legacySessions) {
    if (Number(s.expiresAt) <= now) {
      sessionsExpired++;
      continue;
    }
    const pgUserId = userIdMap.get(s.userId);
    if (!pgUserId) {
      sessionsSkipped++;
      continue;
    }
    const existing = await prisma.session.findUnique({ where: { token: s.token } });
    if (existing) {
      sessionsSkipped++;
      continue;
    }
    await prisma.session.create({
      data: {
        ...(pgUserId === s.userId ? { id: s.id } : {}),
        userId: pgUserId,
        token: s.token,
        expiresAt: date(s.expiresAt),
        createdAt: date(s.createdAt),
      },
    });
    sessionsCreated++;
  }

  /* ---------- Downloads (no natural key — match by id) ---------- */

  const legacyDownloads = sqlite.query("SELECT * FROM Download").all() as LegacyDownload[];
  let downloadsCreated = 0;
  let downloadsSkipped = 0;

  for (const d of legacyDownloads) {
    const pgUserId = userIdMap.get(d.userId);
    if (!pgUserId) {
      downloadsSkipped++;
      continue;
    }
    const existing = await prisma.download.findUnique({ where: { id: d.id } });
    if (existing) {
      downloadsSkipped++;
      continue;
    }
    await prisma.download.create({
      data: {
        id: d.id,
        userId: pgUserId,
        appVersion: d.appVersion,
        platform: d.platform,
        downloadedAt: date(d.downloadedAt),
      },
    });
    downloadsCreated++;
  }

  /* ---------- summary ---------- */

  console.log("┌──────────────────────────────────────────────");
  console.log("│ migrate-sqlite-to-postgres — summary");
  console.log("├──────────────────────────────────────────────");
  console.log(`│ users      : ${usersCreated} created, ${usersSkipped} skipped (already exist)`);
  console.log(`│              ${codesBackfilled} activation code(s) backfilled`);
  console.log(`│ trials     : ${trialsCreated} created, ${trialsSkipped} skipped`);
  console.log(
    `│ sessions   : ${sessionsCreated} created, ${sessionsSkipped} skipped, ${sessionsExpired} expired → dropped`
  );
  console.log(`│ downloads  : ${downloadsCreated} created, ${downloadsSkipped} skipped`);
  console.log("└──────────────────────────────────────────────");
  console.log("");
  console.log("Done. The legacy SQLite file was only read — it is still at db/custom.db.");
}

main()
  .catch((err) => {
    console.error("[migrate-legacy] failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    sqlite.close();
    await prisma.$disconnect();
  });
