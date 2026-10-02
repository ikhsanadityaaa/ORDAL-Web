CREATE TABLE IF NOT EXISTS public.app_feedback (
    id text PRIMARY KEY,
    reference text NOT NULL UNIQUE,
    user_id text NOT NULL REFERENCES public."User"(id) ON DELETE CASCADE,
    category text NOT NULL CHECK (category IN ('bug', 'suggestion', 'automation', 'account', 'payment', 'other')),
    message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 4000),
    diagnostics jsonb,
    status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved', 'closed')),
    created_at timestamptz NOT NULL DEFAULT now(),
    delete_after timestamptz NOT NULL DEFAULT (now() + interval '30 days')
);

CREATE INDEX IF NOT EXISTS app_feedback_user_created_idx ON public.app_feedback(user_id, created_at);
CREATE INDEX IF NOT EXISTS app_feedback_delete_after_idx ON public.app_feedback(delete_after);

ALTER TABLE public.app_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_feedback FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.app_feedback FROM anon, authenticated;

COMMENT ON TABLE public.app_feedback IS 'Desktop feedback retained for 30 days; server API only.';
