CREATE UNIQUE INDEX IF NOT EXISTS app_abuse_events_trial_email_claim_key
ON public.app_abuse_events (subject_hash)
WHERE event_type = 'trial_email_claim';
