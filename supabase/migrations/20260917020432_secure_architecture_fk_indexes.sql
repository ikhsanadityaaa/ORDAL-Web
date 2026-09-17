CREATE INDEX IF NOT EXISTS app_abuse_events_user_id_idx
  ON public.app_abuse_events(user_id);
CREATE INDEX IF NOT EXISTS app_oauth_attempts_user_id_idx
  ON public.app_oauth_attempts(user_id);
CREATE INDEX IF NOT EXISTS app_sessions_secure_deviceId_idx
  ON public.app_sessions_secure("deviceId");
CREATE INDEX IF NOT EXISTS app_verification_codes_secure_user_id_idx
  ON public.app_verification_codes_secure(user_id);
