UPDATE public."User"
SET "emailVerifiedAt" = COALESCE("emailVerifiedAt", "createdAt", now())
WHERE "emailVerifiedAt" IS NULL;
