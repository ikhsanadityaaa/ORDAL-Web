CREATE INDEX IF NOT EXISTS app_abuse_events_created_at_idx
ON public.app_abuse_events (created_at);

CREATE INDEX IF NOT EXISTS app_sessions_secure_expires_at_idx
ON public.app_sessions_secure ("expiresAt");

CREATE INDEX IF NOT EXISTS app_verification_codes_secure_expires_at_idx
ON public.app_verification_codes_secure (expires_at);
