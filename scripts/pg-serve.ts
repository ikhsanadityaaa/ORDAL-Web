/**
 * Local PostgreSQL server for development — embedded-postgres.
 *
 * Runs a REAL PostgreSQL 18 instance without root (binaries live in
 * node_modules). Used for local dev after the SQLite → PostgreSQL
 * migration. In production the app connects to Supabase PostgreSQL
 * via POSTGRES_PRISMA_URL instead — this script never runs on Vercel.
 *
 * Usage (background): bun run scripts/pg-serve.ts
 * Stop: kill the process (SIGTERM cleans up politely)
 */
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "fs";
import path from "path";

const PORT = 5433;
const USER = "ordal";
const PASSWORD = "ordal"; // local dev only — placeholder, never a real credential
const DATABASE = "ordal";
const DATA_DIR = path.join(process.cwd(), "db", "pgdata");

async function main() {
  const pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: true,
  });

  // First run? initialise() runs initdb (skipped when PG_VERSION exists)
  if (!existsSync(path.join(DATA_DIR, "PG_VERSION"))) {
    await pg.initialise();
    console.log("[pg-serve] initialised data dir at", DATA_DIR);
  }

  await pg.start();

  // createDatabase() throws if the DB already exists (restart case)
  try {
    await pg.createDatabase(DATABASE);
    console.log(`[pg-serve] created database "${DATABASE}"`);
  } catch {
    // already exists from a previous run — fine
  }

  console.log(
    `[pg-serve] PostgreSQL ready → postgresql://${USER}:****@localhost:${PORT}/${DATABASE}`
  );

  const shutdown = async () => {
    console.log("[pg-serve] stopping…");
    try {
      await pg.stop();
    } catch {
      // ignore — process is exiting anyway
    }
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[pg-serve] failed to start:", err);
  process.exit(1);
});
