ALTER TABLE public.app_payments
ADD COLUMN IF NOT EXISTS invoice_sent_at timestamptz;
