# ORDAL Web - Engineering Progress

Last updated: 2026-09-20
Branch: `codex/remaining-security-work`
Base commit: `f4a29d4`
Implementation commit: `ec1b661` (pushed to `origin/codex/remaining-security-work`).

## Goal

Make Web/Vercel the authority for authentication, device limits, trials, licenses, complimentary access, and payment verification. Desktop must never receive production database or payment secrets.

## Completed

- Added server-authoritative desktop API under `/api/app`.
- Added opaque app sessions stored as SHA-256 hashes.
- Added two-device enforcement with a PostgreSQL advisory lock.
- Added three-day trial starting on first job search.
- Bound trial eligibility to hashed device and canonical email signals.
- Added Google OAuth Authorization Code + PKCE routes.
- Added email verification routes using Resend HTTP API.
- Added Midtrans QRIS creation and signed webhook verification.
- Added PayPal Orders creation, polling, capture, amount/currency/user checks.
- Added idempotent permanent license issuance.
- Added owner-only complimentary access endpoint.
- Added payment and Google OAuth attempt rate limits with pending-invoice reuse.
- Added correct HTTP 429 responses for desktop registration/login limits.
- Added lazy retention cleanup for expired app sessions, OAuth attempts, verification codes, and old abuse events.
- Added device and canonical-email advisory locks plus a unique trial-email claim index.
- Added runnable password and security architecture self-checks.
- Ignored local Supabase CLI temporary state from Git.
- Added required environment variable documentation in `.env.example`.
- Fixed Windows-incompatible `npm run build` command.
- Web email signup now requires six-digit email verification before a session is issued.
- Added web verification/resend routes with expiry, attempt limits, and resend cooldown.
- Added opt-in Preview integration checks for registration races, trial replay, pending-invoice reuse, and payment-check replay.
- Changed payment creation to reserve one active invoice under a short PostgreSQL advisory-lock transaction, then call gateways outside the transaction.
- Added a partial unique index migration preventing multiple `creating`/`pending` invoices per user and payment method.
- Updated pricing to discounted Rp210,000 → Rp179,000 for Indonesia and US$12 internationally.
- Added branded English payment invoice email with payment details and activation code.
- Added Resend idempotency plus `invoice_sent_at` tracking so payment replays do not duplicate invoices.
- Changed gateway verification to validate each invoice's stored amount, preserving valid pending invoices across future price changes.
- Kept the existing sticker-style UI; the proposed minimalist redesign was canceled before commit.
- Redesigned the hero around the existing dashboard mockup with subtle orbit lines, official JobStreet, LinkedIn, Glints, and Indeed brand assets, floating platform badges, and a static platform row.
- Removed only the marquee directly below the hero; the Problem and Automation Pipeline marquees remain.
- Prisma generation, TypeScript checks, and production build pass.

## Live Supabase Changes

Project: `okaemibpyldhixwfyvnn`

Applied migrations:

- `secure_architecture_v2`
- `secure_architecture_fk_indexes`
- `backfill_existing_verified_users`
- `trial_email_claim_unique`
- `retention_cleanup_indexes`
- `add_user_email_canonical`
- `pending_payment_unique`
- `payment_invoice_email`

Current protection:

- RLS enabled on every table in `public`.
- `anon` and `authenticated` table/sequence privileges revoked.
- Public function execution revoked.
- Future default public privileges revoked.
- Existing accounts marked email-verified to avoid lockout.
- Missing foreign-key indexes added.
- Trial canonical-email claims are unique at database level.
- Expiry and retention-cleanup indexes added.

Security advisor now reports only `rls_enabled_no_policy` informational notices. This is intentional because all database access is server-only through Prisma; Data API roles have no table privileges.

## Verification

- Google OAuth variables are configured in Vercel Production and Preview; Preview `/api/app/auth/google/config` returns `{"configured":true}`.
- Preview callback URLs now use Vercel's stable branch URL automatically; Production continues to use `APP_URL`.
- Web login now supports Google OAuth with PKCE, state-cookie validation, verified Google email linking, and the existing secure web session cookie.
- Live Supabase migration `add_user_email_canonical` applied after Preview exposed schema drift; the column, canonical backfill, and unique index are verified.
- Google web login completed successfully end-to-end on the protected Vercel Preview branch.
- Google signup completed successfully on the latest protected Preview branch.
- Resend Preview configuration is present: `RESEND_API_KEY` is secret and `EMAIL_FROM` uses `ORDAL <onboarding@resend.dev>`.
- `npx prisma generate`: pass.
- `npx tsc --noEmit`: pass.
- `npm run build`: pass, including compilation, type checking, and all 40 generated routes/pages.
- Current branch `npm run build`: pass, including all 42 routes/pages.
- Targeted ESLint for changed auth routes, auth UI, and Preview integration check: pass.
- GitHub-triggered Vercel Preview deployment completed successfully at `https://ordal-djfudw5ss-ikhsan-aditya-s-projects.vercel.app`.
- `npm run check:password`: pass.
- `npm run check:security`: pass.
- Supabase privilege check: `anon` cannot select `User`; `authenticated` cannot insert `app_payments`.
- Supabase security advisor: only intentional `rls_enabled_no_policy` INFO notices remain.
- Supabase performance advisor: only expected unused-index INFO notices on the new/low-traffic database.
- New unique and retention indexes verified in live Supabase.
- Active-payment unique index and invoice email tracking column are verified in live Supabase.
- Payment invoice self-check, targeted ESLint, TypeScript, and production build pass.
- Hero targeted ESLint, TypeScript, production build, desktop visual check, and 390px overflow check pass.

## Required Before Production

1. Security secrets, database URLs, and site URLs are configured in Vercel Production and Preview.
2. Google OAuth Web client, callbacks, test user, web login, and database account creation are verified on Preview.
3. Verify a custom sender domain in Resend and replace the temporary `onboarding@resend.dev` sender before production invoice delivery.
4. Configure Midtrans and PayPal sandbox credentials, test, then switch production flags and credentials.
5. Set Midtrans notification URL to `/api/app/payments/webhook/midtrans` on production domain.
6. Add complimentary emails through `COMPLIMENTARY_EMAILS` or owner endpoint.
7. Buy and connect `applywithordal.com`, then update Vercel URLs and Google callbacks.
8. Authenticate to the protected Vercel Preview, then run end-to-end tests before merge.

## Remaining Engineering Work

- Run `npm run check:preview` against an isolated Preview database using `ORDAL_TEST_API_BASE_URL`; optionally provide `ORDAL_TEST_RACE_EMAIL` and `ORDAL_TEST_APP_TOKEN` for mutating checks.
- Verify Prisma queries against live schema from a preview deployment.
- Review payment API response edge cases using real Midtrans and PayPal sandbox accounts.
- Verify web email signup, resend, expiry, wrong-code limit, and login-after-verification on Preview.
- Deploy preview, run end-to-end flows, then merge only after user approval.
- Wait for Midtrans registration confirmation, then configure sandbox credentials and test QRIS payment, webhook, invoice email, and activation code delivery.

## Current Blockers

- Preview deployment is protected by Vercel Authentication; browser E2E reaches the Vercel login page and requires an authorized account session.
- Midtrans account registration is awaiting confirmation.
- PayPal, production Resend sender-domain, and isolated Preview test credentials are external configuration and are not stored in Git.

## Rules For Next AI

- Do not push directly to `main`.
- Do not put database, OAuth, payment, or admin secrets in repository files or desktop builds.
- Preserve server authority for every access decision.
- Update this file whenever repository state, live database state, tests, blockers, or next steps change.
