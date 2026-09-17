import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const appApi = await readFile("src/lib/app-api.ts", "utf8");
const payments = await readFile("src/lib/payments.ts", "utf8");
const schema = await readFile("prisma/schema.prisma", "utf8");
const webGoogleStart = await readFile("src/app/api/auth/google/start/route.ts", "utf8");
const webGoogleCallback = await readFile("src/app/api/auth/google/callback/route.ts", "utf8");
const migrations = await Promise.all([
  readFile("supabase/migrations/20260917042502_trial_email_claim_unique.sql", "utf8"),
  readFile("supabase/migrations/20260917042721_retention_cleanup_indexes.sql", "utf8"),
  readFile("supabase/migrations/20260917091834_add_user_email_canonical.sql", "utf8"),
]);

assert.match(appApi, /MAX_DEVICES = 2/);
assert.match(appApi, /TRIAL_MS = 3 \* 24 \* 60 \* 60 \* 1000/);
assert.equal((appApi.match(/pg_advisory_xact_lock/g) || []).length >= 3, true);
assert.match(appApi, /session\.expiresAt <= new Date\(\)/);
assert.match(payments, /payment\.status === "verified"/);
assert.match(payments, /payment\.amount !== PRICE_IDR/);
assert.match(payments, /unit\.amount\?\.currency_code === "USD"/);
assert.match(schema, /@@unique\(\[userId, deviceKey\]\)/);
assert.match(migrations.join("\n"), /CREATE UNIQUE INDEX[\s\S]*trial_email_claim/);
assert.match(migrations.join("\n"), /User_emailCanonical_key/);
assert.match(webGoogleStart, /code_challenge_method", "S256"/);
assert.match(webGoogleStart, /httpOnly: true/);
assert.match(webGoogleStart, /req\.nextUrl\.origin !== baseUrl/);
assert.match(webGoogleCallback, /timingSafeEqual/);
assert.match(webGoogleCallback, /createSession\(user\.id\)/);

console.log("security architecture self-check passed");
