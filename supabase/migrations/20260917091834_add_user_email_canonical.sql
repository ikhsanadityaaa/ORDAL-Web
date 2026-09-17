ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS "emailCanonical" text;

WITH normalized AS (
  SELECT
    "id",
    CASE
      WHEN lower(split_part("email", '@', 2)) IN ('gmail.com', 'googlemail.com')
        THEN replace(split_part(split_part(lower("email"), '@', 1), '+', 1), '.', '') || '@gmail.com'
      ELSE split_part(split_part(lower("email"), '@', 1), '+', 1) || '@' || lower(split_part("email", '@', 2))
    END AS canonical
  FROM public."User"
), ranked AS (
  SELECT "id", canonical, row_number() OVER (PARTITION BY canonical ORDER BY "id") AS rn
  FROM normalized
)
UPDATE public."User" AS u
SET "emailCanonical" = CASE WHEN ranked.rn = 1 THEN ranked.canonical ELSE NULL END
FROM ranked
WHERE u."id" = ranked."id" AND u."emailCanonical" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "User_emailCanonical_key"
  ON public."User"("emailCanonical");
