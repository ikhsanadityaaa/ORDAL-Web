# ORDAL Web - Engineering Progress

Last updated: 2026-09-17
Branch: `codex/secure-architecture-v2`
Base commit: `fae0135`
Implementation commits: `97ab8e7`, `873d4ab`, `2f84765`; schema fix: `de980cb`
Remote branch: `origin/codex/secure-architecture-v2`
Merged to `main`: PR #3 at `f4a29d4`

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
- `add_user_email_canonical`

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
- PR #3 merged to `main`; Vercel Production deployment and Google login on `https://ordal-web.vercel.app` still need final verification from the next computer.
- `npx prisma generate`: pass.
- `npx tsc --noEmit`: pass.
- `npm run build`: pass, including compilation, type checking, and all 40 generated routes/pages.
- `npm run check:password`: pass.
- `npm run check:security`: pass.
- Supabase privilege check: `anon` cannot select `User`; `authenticated` cannot insert `app_payments`.
- Supabase security advisor: only intentional `rls_enabled_no_policy` INFO notices remain.
- Supabase performance advisor: only expected unused-index INFO notices on the new/low-traffic database.
- New unique and retention indexes verified in live Supabase.

## Required Before Production

1. Security secrets, database URLs, and site URLs are configured in Vercel Production and Preview.
2. Google OAuth Web client, callbacks, test user, web login, and database account creation are verified on Preview.
3. Configure Resend and set `RESEND_API_KEY`, `EMAIL_FROM`.
4. Configure Midtrans and PayPal sandbox credentials, test, then switch production flags and credentials.
5. Set Midtrans notification URL to `/api/app/payments/webhook/midtrans` on production domain.
6. Add complimentary emails through `COMPLIMENTARY_EMAILS` or owner endpoint.
7. Buy and connect `applywithordal.com`, then update Vercel URLs and Google callbacks.
8. Finish Preview end-to-end tests before merging the latest branch commits.

## Remaining Engineering Work

- Add live concurrency/payment replay integration tests against an isolated preview database.
- Verify Prisma queries against live schema from a preview deployment.
- Review payment API response edge cases using real Midtrans and PayPal sandbox accounts.
- Review existing web signup UX: web may create an unverified account, but desktop blocks access until verification.
- Decide whether web signup must also require email verification before web login.
- Verify the PR #3 Production deployment, then keep later payment/email work on Preview until each flow passes.

## MacBook Handoff

Session stopped because the user moved work to another computer. Repository is clean before this documentation-only update.

Next steps, in order:

1. Pull `main` and verify commit `f4a29d4` is present.
2. Confirm Vercel Production is `Ready`, then test Google login at `https://ordal-web.vercel.app`.
3. Configure Resend test mode, then set `RESEND_API_KEY` as Secret and `EMAIL_FROM` as Config for Production and Preview. Do not paste either value into chat.
4. Test email registration, verification, login, resend-code throttling, and rejection of disposable email domains.
5. Configure Midtrans Sandbox and PayPal Sandbox; test signed webhooks, replay resistance, exact amount/currency checks, and permanent license issuance.
6. Test complimentary access using the owner endpoint or `COMPLIMENTARY_EMAILS`.
7. Run full desktop/web end-to-end tests: two-device limit, device removal, three-day trial, reinstall resistance, payment, activation, and logout.
8. Buy `applywithordal.com` near launch, connect it to Vercel, update `APP_URL` and `NEXT_PUBLIC_SITE_URL`, update all Google callback URLs, and verify a sending domain in Resend.

Current external setup:

- Vercel database/security/site variables: configured for Production and Preview.
- Google OAuth client, Production callbacks, Preview branch callbacks, and test user: configured.
- Live Supabase project `okaemibpyldhixwfyvnn`: healthy; `emailCanonical` column and unique index verified.
- Resend, Midtrans, PayPal, download URLs, and final custom domain: not configured.

## Rules For Next AI

- Do not push directly to `main`.
- Do not put database, OAuth, payment, or admin secrets in repository files or desktop builds.
- Preserve server authority for every access decision.
- Update this file whenever repository state, live database state, tests, blockers, or next steps change.
