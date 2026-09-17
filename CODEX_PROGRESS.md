# ORDAL Web - Engineering Progress

Last updated: 2026-09-17
Branch: `codex/secure-architecture-v2`
Base commit: `fae0135`
Implementation commit: `97ab8e7`; housekeeping commit: `cd1523f`
Remote branch: `origin/codex/secure-architecture-v2`

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
- Prisma generation, TypeScript checks, and production build pass.

## Live Supabase Changes

Project: `okaemibpyldhixwfyvnn`

Applied migrations:

- `secure_architecture_v2`
- `secure_architecture_fk_indexes`
- `backfill_existing_verified_users`
- `trial_email_claim_unique`
- `retention_cleanup_indexes`

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

- `npx prisma generate`: pass.
- `npx tsc --noEmit`: pass.
- `npm run build`: pass, including compilation, type checking, and all 38 generated routes/pages.
- `npm run check:password`: pass.
- `npm run check:security`: pass.
- Supabase privilege check: `anon` cannot select `User`; `authenticated` cannot insert `app_payments`.
- Supabase security advisor: only intentional `rls_enabled_no_policy` INFO notices remain.
- Supabase performance advisor: only expected unused-index INFO notices on the new/low-traffic database.
- New unique and retention indexes verified in live Supabase.

## Required Before Production

1. Set generated 32+ byte values in Vercel: `DEVICE_HASH_PEPPER`, `EMAIL_CODE_SECRET`, `ADMIN_API_TOKEN`, `ABUSE_HASH_SECRET`.
2. Set `APP_URL=https://ordal-web.vercel.app` now; change to `https://applywithordal.com` after domain migration.
3. Configure Google OAuth Web application and set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
4. Configure Resend and set `RESEND_API_KEY`, `EMAIL_FROM`.
5. Configure Midtrans and PayPal sandbox credentials, test, then switch production flags and credentials.
6. Set Midtrans notification URL to `/api/app/payments/webhook/midtrans` on production domain.
7. Add complimentary emails through `COMPLIMENTARY_EMAILS` or owner endpoint.
8. Deploy feature branch to Vercel preview and run end-to-end tests before merging.

## Remaining Engineering Work

- Add live concurrency/payment replay integration tests against an isolated preview database.
- Verify Prisma queries against live schema from a preview deployment.
- Review payment API response edge cases using real Midtrans and PayPal sandbox accounts.
- Review existing web signup UX: web may create an unverified account, but desktop blocks access until verification.
- Decide whether web signup must also require email verification before web login.
- Deploy preview, run end-to-end flows, then merge only after user approval.

## Rules For Next AI

- Do not push directly to `main`.
- Do not put database, OAuth, payment, or admin secrets in repository files or desktop builds.
- Preserve server authority for every access decision.
- Update this file whenever repository state, live database state, tests, blockers, or next steps change.
