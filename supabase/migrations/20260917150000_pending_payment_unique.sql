UPDATE app_payments
SET status = 'expired'
WHERE status IN ('creating', 'pending') AND expires_at <= now();

WITH ranked AS (
  SELECT id, row_number() OVER (
    PARTITION BY user_id, method
    ORDER BY created_at DESC, id DESC
  ) AS position
  FROM app_payments
  WHERE status IN ('creating', 'pending')
)
UPDATE app_payments AS payment
SET status = 'expired', note = concat_ws('; ', payment.note, 'deduplicated before active-payment unique index')
FROM ranked
WHERE payment.id = ranked.id AND ranked.position > 1;

CREATE UNIQUE INDEX IF NOT EXISTS app_payments_one_active_method_per_user
ON app_payments (user_id, method)
WHERE status IN ('creating', 'pending');
