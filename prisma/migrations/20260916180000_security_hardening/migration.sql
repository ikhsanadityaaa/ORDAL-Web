ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailCanonical" TEXT;

WITH normalized AS (
  SELECT
    "id",
    CASE
      WHEN lower(split_part("email", '@', 2)) IN ('gmail.com', 'googlemail.com')
        THEN replace(split_part(split_part(lower("email"), '@', 1), '+', 1), '.', '') || '@gmail.com'
      ELSE split_part(split_part(lower("email"), '@', 1), '+', 1) || '@' || lower(split_part("email", '@', 2))
    END AS canonical
  FROM "User"
), ranked AS (
  SELECT "id", canonical, row_number() OVER (PARTITION BY canonical ORDER BY "id") AS rn
  FROM normalized
)
UPDATE "User" AS u
SET "emailCanonical" = CASE WHEN ranked.rn = 1 THEN ranked.canonical ELSE NULL END
FROM ranked
WHERE u."id" = ranked."id" AND u."emailCanonical" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "User_emailCanonical_key" ON "User"("emailCanonical");

CREATE TABLE IF NOT EXISTS "app_abuse_events" (
  "id" BIGSERIAL PRIMARY KEY,
  "event_type" TEXT NOT NULL,
  "subject_hash" TEXT NOT NULL,
  "user_id" TEXT,
  "detail" TEXT NOT NULL DEFAULT '',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "app_abuse_events_userId_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "app_abuse_events_eventType_subjectHash_createdAt_idx"
ON "app_abuse_events"("event_type", "subject_hash", "created_at");

CREATE TABLE IF NOT EXISTS "app_trial_grants" (
  "user_id" TEXT PRIMARY KEY,
  "canonical_email_hash" TEXT NOT NULL UNIQUE,
  "device_hash" TEXT NOT NULL UNIQUE,
  "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "app_trial_grants_userId_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
