-- SÈN order confirmation/contact workflow.
-- Existing orders are never messaged by this migration: historical rows are
-- backfilled as waiting_consent unless already fulfilled/cancelled.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS whatsapp_consent_at timestamptz;

CREATE TABLE IF NOT EXISTS private.order_contact_suppressions (
  phone_e164 text PRIMARY KEY,
  requested_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL CHECK (source IN ('whatsapp_keyword', 'admin_request', 'privacy_request')),
  last_inbound_message_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS private.order_contact_settings (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO private.order_contact_settings (singleton, enabled)
VALUES (true, false)
ON CONFLICT (singleton) DO NOTHING;

CREATE TABLE IF NOT EXISTS private.order_contact_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'whatsapp' CHECK (channel = 'whatsapp'),
  contact_status text NOT NULL DEFAULT 'waiting_consent'
    CHECK (contact_status IN (
      'waiting_consent', 'waiting_setup', 'queued', 'sending', 'sent',
      'delivered', 'read', 'confirmed', 'cancelled', 'failed',
      'no_response', 'opted_out'
    )),
  consent_at timestamptz,
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  max_attempts integer NOT NULL DEFAULT 3 CHECK (max_attempts BETWEEN 1 AND 3),
  result_notice_status text NOT NULL DEFAULT 'not_needed'
    CHECK (result_notice_status IN ('not_needed', 'waiting_setup', 'queued', 'sending', 'sent', 'failed', 'opted_out')),
  result_attempt_count integer NOT NULL DEFAULT 0 CHECK (result_attempt_count >= 0),
  last_attempt_at timestamptz,
  next_attempt_at timestamptz,
  response_deadline_at timestamptz,
  lease_until timestamptz,
  provider_message_id text UNIQUE,
  provider_status text,
  result_provider_message_id text UNIQUE,
  last_error_code text,
  result_last_error_code text,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS private.order_contact_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES private.order_contact_events(id) ON DELETE CASCADE,
  message_kind text NOT NULL CHECK (message_kind IN ('initial', 'result')),
  attempt_number integer NOT NULL CHECK (attempt_number > 0),
  status text NOT NULL DEFAULT 'sending'
    CHECK (status IN ('sending', 'sent', 'delivered', 'read', 'failed', 'unknown')),
  provider_message_id text UNIQUE,
  error_code text,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (event_id, message_kind, attempt_number)
);

CREATE TABLE IF NOT EXISTS private.order_contact_webhook_receipts (
  provider_message_id text PRIMARY KEY,
  message_kind text NOT NULL CHECK (message_kind IN ('reply', 'opt_out')),
  received_at timestamptz NOT NULL DEFAULT now(),
  outcome text NOT NULL DEFAULT 'received'
);

CREATE INDEX IF NOT EXISTS idx_order_contact_events_dispatch
  ON private.order_contact_events (contact_status, next_attempt_at, created_at);
CREATE INDEX IF NOT EXISTS idx_order_contact_events_result_dispatch
  ON private.order_contact_events (result_notice_status, created_at);
CREATE INDEX IF NOT EXISTS idx_order_contact_attempts_message_id
  ON private.order_contact_attempts (provider_message_id);

ALTER TABLE private.order_contact_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.order_contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.order_contact_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.order_contact_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.order_contact_webhook_receipts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE private.order_contact_suppressions FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE private.order_contact_settings FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE private.order_contact_events FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE private.order_contact_attempts FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE private.order_contact_webhook_receipts FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE private.order_contact_suppressions TO service_role;
GRANT ALL ON TABLE private.order_contact_settings TO service_role;
GRANT ALL ON TABLE private.order_contact_events TO service_role;
GRANT ALL ON TABLE private.order_contact_attempts TO service_role;
GRANT ALL ON TABLE private.order_contact_webhook_receipts TO service_role;

CREATE POLICY "Service role manages order contact suppressions"
  ON private.order_contact_suppressions FOR ALL TO service_role
  USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages order contact settings"
  ON private.order_contact_settings FOR ALL TO service_role
  USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages order contact events"
  ON private.order_contact_events FOR ALL TO service_role
  USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages order contact attempts"
  ON private.order_contact_attempts FOR ALL TO service_role
  USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages order contact webhook receipts"
  ON private.order_contact_webhook_receipts FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION private.normalize_egypt_phone(p_phone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = pg_catalog
AS $$
DECLARE
  v_digits text := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
BEGIN
  IF v_digits ~ '^01[0125][0-9]{8}$' THEN
    RETURN '20' || substr(v_digits, 2);
  END IF;
  IF v_digits ~ '^201[0125][0-9]{8}$' THEN
    RETURN v_digits;
  END IF;
  IF v_digits ~ '^00201[0125][0-9]{8}$' THEN
    RETURN substr(v_digits, 3);
  END IF;
  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION private.normalize_egypt_phone(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.normalize_egypt_phone(text) TO service_role;

CREATE OR REPLACE FUNCTION private.enqueue_order_contact_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  v_phone text := private.normalize_egypt_phone(NEW.phone);
  v_status text;
BEGIN
  IF NEW.status = 'CANCELLED' THEN
    v_status := 'cancelled';
  ELSIF NEW.status IN ('CONFIRMED', 'SHIPPED', 'DELIVERED') THEN
    v_status := 'confirmed';
  ELSIF EXISTS (
    SELECT 1 FROM private.order_contact_suppressions s WHERE s.phone_e164 = v_phone
  ) THEN
    v_status := 'opted_out';
  ELSIF NEW.whatsapp_consent_at IS NOT NULL THEN
    v_status := 'queued';
  ELSE
    v_status := 'waiting_consent';
  END IF;

  INSERT INTO private.order_contact_events (order_id, contact_status, consent_at)
  VALUES (NEW.id, v_status, NEW.whatsapp_consent_at)
  ON CONFLICT (order_id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.enqueue_order_contact_event() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.sync_order_contact_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  v_phone text := private.normalize_egypt_phone(NEW.phone);
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'CANCELLED' THEN
      UPDATE private.order_contact_events
      SET contact_status = 'cancelled', lease_until = NULL, next_attempt_at = NULL,
          updated_at = now()
      WHERE order_id = NEW.id AND contact_status NOT IN ('confirmed', 'cancelled', 'opted_out');
    ELSIF NEW.status IN ('CONFIRMED', 'SHIPPED', 'DELIVERED') THEN
      UPDATE private.order_contact_events
      SET contact_status = 'confirmed', lease_until = NULL, next_attempt_at = NULL,
          updated_at = now()
      WHERE order_id = NEW.id AND contact_status NOT IN ('confirmed', 'cancelled', 'opted_out');
    END IF;
  END IF;

  IF NEW.whatsapp_consent_at IS DISTINCT FROM OLD.whatsapp_consent_at THEN
    IF NEW.whatsapp_consent_at IS NOT NULL
       AND NEW.status = 'PENDING'
       AND NOT EXISTS (
         SELECT 1 FROM private.order_contact_suppressions s WHERE s.phone_e164 = v_phone
       ) THEN
      UPDATE private.order_contact_events
      SET contact_status = CASE
            WHEN contact_status = 'waiting_consent' THEN 'queued'
            ELSE contact_status
          END,
          consent_at = NEW.whatsapp_consent_at,
          next_attempt_at = now(),
          updated_at = now()
      WHERE order_id = NEW.id;
    ELSIF NEW.whatsapp_consent_at IS NULL THEN
      UPDATE private.order_contact_events
      SET contact_status = CASE
            WHEN contact_status IN ('queued', 'waiting_setup') THEN 'waiting_consent'
            ELSE contact_status
          END,
          consent_at = NULL,
          next_attempt_at = NULL,
          updated_at = now()
      WHERE order_id = NEW.id AND contact_status <> 'opted_out';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.sync_order_contact_event() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS orders_enqueue_contact_event ON public.orders;
CREATE TRIGGER orders_enqueue_contact_event
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION private.enqueue_order_contact_event();

DROP TRIGGER IF EXISTS orders_sync_contact_event ON public.orders;
CREATE TRIGGER orders_sync_contact_event
  AFTER UPDATE OF status, whatsapp_consent_at ON public.orders
  FOR EACH ROW EXECUTE FUNCTION private.sync_order_contact_event();

-- Historical rows have no recorded opt-in, therefore they can never be sent automatically.
INSERT INTO private.order_contact_events (order_id, contact_status, consent_at)
SELECT o.id,
       CASE
         WHEN o.status = 'CANCELLED' THEN 'cancelled'
         WHEN o.status IN ('CONFIRMED', 'SHIPPED', 'DELIVERED') THEN 'confirmed'
         WHEN EXISTS (
           SELECT 1 FROM private.order_contact_suppressions s
           WHERE s.phone_e164 = private.normalize_egypt_phone(o.phone)
         ) THEN 'opted_out'
         ELSE 'waiting_consent'
       END,
       NULL
FROM public.orders o
WHERE NOT EXISTS (
  SELECT 1 FROM private.order_contact_events e WHERE e.order_id = o.id
)
ON CONFLICT (order_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.submit_checkout_with_contact(
  p_customer_name text,
  p_phone text,
  p_governorate text,
  p_address text,
  p_notes text DEFAULT NULL,
  p_items jsonb DEFAULT '[]'::jsonb,
  p_discount_code text DEFAULT NULL,
  p_idempotency_key uuid DEFAULT NULL,
  p_website text DEFAULT NULL,
  p_whatsapp_consent boolean DEFAULT false
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
BEGIN
  v_order := public.submit_checkout(
    p_customer_name, p_phone, p_governorate, p_address,
    p_notes, p_items, p_discount_code, p_idempotency_key, p_website
  );
  IF coalesce(p_whatsapp_consent, false) THEN
    UPDATE public.orders
    SET whatsapp_consent_at = coalesce(whatsapp_consent_at, now())
    WHERE id = v_order.id AND status = 'PENDING';
    SELECT * INTO v_order FROM public.orders WHERE id = v_order.id;
  END IF;
  RETURN v_order;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_checkout_with_contact(text, text, text, text, text, jsonb, text, uuid, text, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_checkout_with_contact(text, text, text, text, text, jsonb, text, uuid, text, boolean) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_order_contact_admin_log(p_order_number text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  v_order_number text := nullif(trim(coalesce(p_order_number, '')), '');
  v_result jsonb;
BEGIN
  IF NOT private.is_order_admin() THEN
    RAISE EXCEPTION 'غير مصرح' USING ERRCODE = '42501';
  END IF;

  SELECT coalesce(jsonb_agg(row_data.payload ORDER BY row_data.created_at DESC), '[]'::jsonb)
  INTO v_result
  FROM (
    SELECT e.created_at,
      jsonb_build_object(
        'event_id', e.id,
        'order_number', o.order_number,
        'contact_status', e.contact_status,
        'attempt_count', e.attempt_count,
        'max_attempts', e.max_attempts,
        'last_attempt_at', e.last_attempt_at,
        'last_error_code', e.last_error_code,
        'provider_status', e.provider_status,
        'consent_at', e.consent_at,
        'result_notice_status', e.result_notice_status,
        'attempts', coalesce((
          SELECT jsonb_agg(attempt_data.payload ORDER BY attempt_data.attempted_at DESC)
          FROM (
            SELECT jsonb_build_object(
              'message_kind', a.message_kind,
              'attempt_number', a.attempt_number,
              'status', a.status,
              'error_code', a.error_code,
              'attempted_at', a.attempted_at,
              'completed_at', a.completed_at
            ) AS payload, a.attempted_at
            FROM private.order_contact_attempts a
            WHERE a.event_id = e.id
            ORDER BY a.attempted_at DESC
            LIMIT 5
          ) attempt_data
        ), '[]'::jsonb)
      ) AS payload
    FROM private.order_contact_events e
    JOIN public.orders o ON o.id = e.order_id
    WHERE v_order_number IS NULL OR o.order_number = v_order_number
    ORDER BY e.created_at DESC
    LIMIT 200
  ) row_data;
  RETURN v_result;
END;
$$;
REVOKE ALL ON FUNCTION public.get_order_contact_admin_log(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_order_contact_admin_log(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.verify_order_contact_cron_token(p_token text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, private, vault
AS $$
  SELECT p_token IS NOT NULL
    AND length(p_token) >= 32
    AND p_token = (
      SELECT decrypted_secret
      FROM vault.decrypted_secrets
      WHERE name = 'sen_order_contact_cron_token'
      LIMIT 1
    );
$$;
REVOKE ALL ON FUNCTION public.verify_order_contact_cron_token(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_order_contact_cron_token(text) TO service_role;

CREATE OR REPLACE FUNCTION public.is_order_contact_enabled()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
  SELECT coalesce((SELECT enabled FROM private.order_contact_settings WHERE singleton = true), false);
$$;
REVOKE ALL ON FUNCTION public.is_order_contact_enabled() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_order_contact_enabled() TO service_role;

CREATE OR REPLACE FUNCTION public.set_order_contact_setup_ready(p_ready boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
BEGIN
  IF coalesce(p_ready, false) THEN
    UPDATE private.order_contact_events e
    SET contact_status = 'queued', next_attempt_at = now(), updated_at = now()
    FROM public.orders o
    WHERE o.id = e.order_id AND e.contact_status = 'waiting_setup'
      AND e.consent_at IS NOT NULL AND o.status = 'PENDING'
      AND NOT EXISTS (
        SELECT 1 FROM private.order_contact_suppressions s
        WHERE s.phone_e164 = private.normalize_egypt_phone(o.phone)
      );
    UPDATE private.order_contact_events e
    SET result_notice_status = 'queued', updated_at = now()
    FROM public.orders o
    WHERE o.id = e.order_id AND e.result_notice_status = 'waiting_setup'
      AND o.status IN ('CONFIRMED', 'CANCELLED')
      AND NOT EXISTS (
        SELECT 1 FROM private.order_contact_suppressions s
        WHERE s.phone_e164 = private.normalize_egypt_phone(o.phone)
      );
  ELSE
    UPDATE private.order_contact_events
    SET contact_status = 'waiting_setup', updated_at = now()
    WHERE contact_status = 'queued';
    UPDATE private.order_contact_events
    SET result_notice_status = 'waiting_setup', updated_at = now()
    WHERE result_notice_status = 'queued';
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.set_order_contact_setup_ready(boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_order_contact_setup_ready(boolean) TO service_role;

CREATE OR REPLACE FUNCTION public.claim_order_contact_batch(p_limit integer DEFAULT 10)
RETURNS TABLE (event_id uuid, message_kind text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
BEGIN
  RETURN QUERY
  WITH candidates AS (
    SELECT e.id,
      CASE WHEN e.contact_status = 'queued' THEN 'initial' ELSE 'result' END AS kind
    FROM private.order_contact_events e
    JOIN public.orders o ON o.id = e.order_id
    WHERE e.lease_until IS NULL
      AND (
        (e.contact_status = 'queued'
          AND coalesce(e.next_attempt_at, now()) <= now()
          AND e.attempt_count < e.max_attempts
          AND o.status = 'PENDING'
          AND o.whatsapp_consent_at IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM private.order_contact_suppressions s
            WHERE s.phone_e164 = private.normalize_egypt_phone(o.phone)
          ))
        OR
        (e.result_notice_status = 'queued'
          AND e.result_attempt_count < e.max_attempts
          AND o.status IN ('CONFIRMED', 'CANCELLED')
          AND NOT EXISTS (
            SELECT 1 FROM private.order_contact_suppressions s
            WHERE s.phone_e164 = private.normalize_egypt_phone(o.phone)
          ))
      )
    ORDER BY e.created_at
    FOR UPDATE OF e SKIP LOCKED
    LIMIT least(greatest(coalesce(p_limit, 10), 1), 20)
  ), claimed AS (
    UPDATE private.order_contact_events e
    SET contact_status = CASE WHEN c.kind = 'initial' THEN 'sending' ELSE e.contact_status END,
        result_notice_status = CASE WHEN c.kind = 'result' THEN 'sending' ELSE e.result_notice_status END,
        attempt_count = CASE WHEN c.kind = 'initial' THEN e.attempt_count + 1 ELSE e.attempt_count END,
        result_attempt_count = CASE WHEN c.kind = 'result' THEN e.result_attempt_count + 1 ELSE e.result_attempt_count END,
        last_attempt_at = now(),
        lease_until = now() + interval '5 minutes',
        updated_at = now()
    FROM candidates c
    WHERE e.id = c.id
    RETURNING e.id, c.kind,
      CASE WHEN c.kind = 'initial' THEN e.attempt_count ELSE e.result_attempt_count END AS attempt_no
  ), logged AS (
    INSERT INTO private.order_contact_attempts (event_id, message_kind, attempt_number, status)
    SELECT id, kind, attempt_no, 'sending' FROM claimed
    RETURNING event_id, message_kind
  )
  SELECT c.id, c.kind FROM claimed c JOIN logged l
    ON l.event_id = c.id AND l.message_kind = c.kind;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_order_contact_batch(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_order_contact_batch(integer) TO service_role;

CREATE OR REPLACE FUNCTION public.get_order_contact_message(p_event_id uuid, p_message_kind text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF p_message_kind NOT IN ('initial', 'result') THEN
    RETURN NULL;
  END IF;
  SELECT jsonb_build_object(
    'event_id', e.id,
    'message_kind', p_message_kind,
    'phone_e164', private.normalize_egypt_phone(o.phone),
    'customer_name', left(coalesce(o.customer_name, ''), 80),
    'order_number', o.order_number,
    'order_status', o.status,
    'items_summary', coalesce((
      SELECT string_agg(
        left(coalesce(item.value ->> 'name', item.value ->> 'name_ar', 'منتج'), 60)
        || ' × ' || coalesce(item.value ->> 'quantity', '1'),
        '، ' ORDER BY item.ordinality
      )
      FROM jsonb_array_elements(CASE WHEN jsonb_typeof(o.items) = 'array' THEN o.items ELSE '[]'::jsonb END)
        WITH ORDINALITY AS item(value, ordinality)
    ), 'طلب متجر SÈN'),
    'total_amount', o.total_amount,
    'contact_status', e.contact_status,
    'result_notice_status', e.result_notice_status
  ) INTO v_result
  FROM private.order_contact_events e
  JOIN public.orders o ON o.id = e.order_id
  WHERE e.id = p_event_id
    AND e.lease_until > now()
    AND (
      (p_message_kind = 'initial'
        AND e.contact_status = 'sending'
        AND o.status = 'PENDING'
        AND o.whatsapp_consent_at IS NOT NULL)
      OR
      (p_message_kind = 'result'
        AND e.result_notice_status = 'sending'
        AND o.status IN ('CONFIRMED', 'CANCELLED'))
    )
    AND NOT EXISTS (
      SELECT 1 FROM private.order_contact_suppressions s
      WHERE s.phone_e164 = private.normalize_egypt_phone(o.phone)
    )
  LIMIT 1;
  RETURN v_result;
END;
$$;
REVOKE ALL ON FUNCTION public.get_order_contact_message(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_order_contact_message(uuid, text) TO service_role;

CREATE OR REPLACE FUNCTION public.complete_order_contact_attempt(
  p_event_id uuid,
  p_message_kind text,
  p_outcome text,
  p_provider_message_id text DEFAULT NULL,
  p_error_code text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  v_event private.order_contact_events%ROWTYPE;
  v_attempt_number integer;
  v_safe_error text := CASE
    WHEN p_error_code ~ '^[A-Za-z0-9_.-]{1,80}$' THEN p_error_code
    WHEN p_error_code IS NULL OR p_error_code = '' THEN NULL
    ELSE 'provider_error'
  END;
  v_attempt_status text;
BEGIN
  IF p_message_kind NOT IN ('initial', 'result') OR p_outcome NOT IN ('sent', 'retryable', 'failed', 'uncertain') THEN
    RAISE EXCEPTION 'invalid contact attempt outcome' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_event FROM private.order_contact_events WHERE id = p_event_id FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  v_attempt_number := CASE WHEN p_message_kind = 'initial' THEN v_event.attempt_count ELSE v_event.result_attempt_count END;
  v_attempt_status := CASE WHEN p_outcome = 'sent' THEN 'sent' WHEN p_outcome = 'uncertain' THEN 'unknown' ELSE 'failed' END;

  UPDATE private.order_contact_attempts
  SET status = v_attempt_status,
      provider_message_id = CASE WHEN p_outcome = 'sent' THEN nullif(p_provider_message_id, '') ELSE provider_message_id END,
      error_code = v_safe_error,
      completed_at = now()
  WHERE event_id = p_event_id AND message_kind = p_message_kind AND attempt_number = v_attempt_number;

  IF p_message_kind = 'initial' THEN
    IF p_outcome = 'sent' AND nullif(p_provider_message_id, '') IS NOT NULL THEN
      UPDATE private.order_contact_events
      SET contact_status = 'sent',
          provider_message_id = p_provider_message_id,
          provider_status = 'sent',
          response_deadline_at = now() + interval '48 hours',
          last_error_code = NULL, lease_until = NULL, next_attempt_at = NULL,
          updated_at = now()
      WHERE id = p_event_id;
    ELSIF p_outcome = 'retryable' AND v_event.attempt_count < v_event.max_attempts THEN
      UPDATE private.order_contact_events
      SET contact_status = 'queued',
          last_error_code = coalesce(v_safe_error, 'provider_retryable'),
          next_attempt_at = now() + make_interval(mins => least(60, 5 * v_event.attempt_count)),
          lease_until = NULL, updated_at = now()
      WHERE id = p_event_id;
    ELSE
      UPDATE private.order_contact_events
      SET contact_status = 'failed',
          last_error_code = coalesce(v_safe_error, CASE WHEN p_outcome = 'uncertain' THEN 'provider_timeout_uncertain' ELSE 'provider_error' END),
          lease_until = NULL, next_attempt_at = NULL, updated_at = now()
      WHERE id = p_event_id;
    END IF;
  ELSE
    IF p_outcome = 'sent' AND nullif(p_provider_message_id, '') IS NOT NULL THEN
      UPDATE private.order_contact_events
      SET result_notice_status = 'sent',
          result_provider_message_id = p_provider_message_id,
          result_last_error_code = NULL, lease_until = NULL, updated_at = now()
      WHERE id = p_event_id;
    ELSIF p_outcome = 'retryable' AND v_event.result_attempt_count < v_event.max_attempts THEN
      UPDATE private.order_contact_events
      SET result_notice_status = 'queued',
          result_last_error_code = coalesce(v_safe_error, 'provider_retryable'),
          lease_until = NULL, updated_at = now()
      WHERE id = p_event_id;
    ELSE
      UPDATE private.order_contact_events
      SET result_notice_status = 'failed',
          result_last_error_code = coalesce(v_safe_error, CASE WHEN p_outcome = 'uncertain' THEN 'provider_timeout_uncertain' ELSE 'provider_error' END),
          lease_until = NULL, updated_at = now()
      WHERE id = p_event_id;
    END IF;
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.complete_order_contact_attempt(uuid, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_order_contact_attempt(uuid, text, text, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.apply_order_contact_reply(
  p_message_id text,
  p_context_message_id text,
  p_from_phone text,
  p_button_label text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  v_event_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_phone text := private.normalize_egypt_phone(p_from_phone);
  v_stored_phone text;
  v_decision text;
  v_order_status text;
  v_customer_name text;
  v_total numeric;
  v_inserted text;
BEGIN
  IF nullif(p_message_id, '') IS NULL OR length(p_message_id) > 255
     OR nullif(p_context_message_id, '') IS NULL OR length(p_context_message_id) > 255
     OR v_phone IS NULL THEN
    RETURN jsonb_build_object('accepted', false, 'reason', 'invalid_payload');
  END IF;
  v_decision := CASE trim(coalesce(p_button_label, ''))
    WHEN 'تأكيد الطلب' THEN 'CONFIRMED'
    WHEN 'إلغاء الطلب' THEN 'CANCELLED'
    ELSE NULL
  END;
  IF v_decision IS NULL THEN
    RETURN jsonb_build_object('accepted', false, 'reason', 'unknown_button');
  END IF;

  SELECT e.id, o.id, o.order_number, o.status, o.customer_name, o.total_amount,
         private.normalize_egypt_phone(o.phone)
  INTO v_event_id, v_order_id, v_order_number, v_order_status, v_customer_name, v_total, v_stored_phone
  FROM private.order_contact_attempts a
  JOIN private.order_contact_events e ON e.id = a.event_id
  JOIN public.orders o ON o.id = e.order_id
  WHERE a.provider_message_id = p_context_message_id
    AND a.message_kind = 'initial'
    AND e.consent_at IS NOT NULL
  FOR UPDATE OF e, o
  LIMIT 1;

  IF v_event_id IS NULL THEN
    -- Meta may deliver the user's quick reply before the dispatcher persists the
    -- provider message ID. A 5xx from the Edge Function asks Meta to retry.
    RETURN jsonb_build_object('accepted', false, 'reason', 'pending_context');
  END IF;
  IF v_stored_phone IS DISTINCT FROM v_phone THEN
    INSERT INTO private.order_contact_webhook_receipts (provider_message_id, message_kind, outcome)
    VALUES (p_message_id, 'reply', 'sender_mismatch')
    ON CONFLICT (provider_message_id) DO NOTHING;
    RETURN jsonb_build_object('accepted', false, 'reason', 'sender_mismatch');
  END IF;

  INSERT INTO private.order_contact_webhook_receipts (provider_message_id, message_kind)
  VALUES (p_message_id, 'reply')
  ON CONFLICT (provider_message_id) DO NOTHING
  RETURNING provider_message_id INTO v_inserted;
  IF v_inserted IS NULL THEN
    RETURN jsonb_build_object('accepted', false, 'reason', 'duplicate');
  END IF;
  IF v_order_status <> 'PENDING' THEN
    UPDATE private.order_contact_webhook_receipts SET outcome = 'stale_order' WHERE provider_message_id = p_message_id;
    RETURN jsonb_build_object('accepted', false, 'reason', 'order_not_pending');
  END IF;
  IF EXISTS (SELECT 1 FROM private.order_contact_suppressions s WHERE s.phone_e164 = v_phone) THEN
    UPDATE private.order_contact_events
    SET contact_status = 'opted_out', result_notice_status = 'opted_out', lease_until = NULL, updated_at = now()
    WHERE id = v_event_id;
    UPDATE private.order_contact_webhook_receipts SET outcome = 'opted_out' WHERE provider_message_id = p_message_id;
    RETURN jsonb_build_object('accepted', false, 'reason', 'opted_out');
  END IF;

  UPDATE public.orders SET status = v_decision, updated_at = now() WHERE id = v_order_id AND status = 'PENDING';
  IF NOT FOUND THEN
    UPDATE private.order_contact_webhook_receipts SET outcome = 'stale_order' WHERE provider_message_id = p_message_id;
    RETURN jsonb_build_object('accepted', false, 'reason', 'order_not_pending');
  END IF;
  UPDATE private.order_contact_events
  SET contact_status = CASE WHEN v_decision = 'CONFIRMED' THEN 'confirmed' ELSE 'cancelled' END,
      result_notice_status = 'queued', responded_at = now(), lease_until = NULL,
      next_attempt_at = NULL, updated_at = now()
  WHERE id = v_event_id;
  UPDATE private.order_contact_webhook_receipts SET outcome = 'applied' WHERE provider_message_id = p_message_id;

  RETURN jsonb_build_object(
    'accepted', true,
    'decision', v_decision,
    'event_id', v_event_id,
    'order_number', v_order_number,
    'phone_e164', v_phone,
    'customer_name', left(coalesce(v_customer_name, ''), 80),
    'total_amount', v_total
  );
END;
$$;
REVOKE ALL ON FUNCTION public.apply_order_contact_reply(text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_order_contact_reply(text, text, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.record_order_contact_opt_out(p_message_id text, p_from_phone text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  v_phone text := private.normalize_egypt_phone(p_from_phone);
  v_inserted text;
BEGIN
  IF nullif(p_message_id, '') IS NULL OR length(p_message_id) > 255 OR v_phone IS NULL THEN
    RETURN jsonb_build_object('accepted', false, 'reason', 'invalid_payload');
  END IF;
  INSERT INTO private.order_contact_webhook_receipts (provider_message_id, message_kind)
  VALUES (p_message_id, 'opt_out')
  ON CONFLICT (provider_message_id) DO NOTHING
  RETURNING provider_message_id INTO v_inserted;
  IF v_inserted IS NULL THEN
    RETURN jsonb_build_object('accepted', false, 'reason', 'duplicate');
  END IF;

  INSERT INTO private.order_contact_suppressions (phone_e164, source, last_inbound_message_id)
  VALUES (v_phone, 'whatsapp_keyword', p_message_id)
  ON CONFLICT (phone_e164) DO UPDATE
    SET requested_at = now(), source = 'whatsapp_keyword', last_inbound_message_id = EXCLUDED.last_inbound_message_id;

  UPDATE private.order_contact_events e
  SET contact_status = 'opted_out',
      result_notice_status = CASE WHEN result_notice_status IN ('queued', 'sending') THEN 'opted_out' ELSE result_notice_status END,
      lease_until = NULL, next_attempt_at = NULL, updated_at = now()
  FROM public.orders o
  WHERE o.id = e.order_id
    AND private.normalize_egypt_phone(o.phone) = v_phone
    AND e.contact_status NOT IN ('confirmed', 'cancelled', 'opted_out');

  UPDATE private.order_contact_webhook_receipts SET outcome = 'opted_out' WHERE provider_message_id = p_message_id;
  RETURN jsonb_build_object('accepted', true, 'reason', 'opted_out');
END;
$$;
REVOKE ALL ON FUNCTION public.record_order_contact_opt_out(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_order_contact_opt_out(text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.update_order_contact_delivery(p_provider_message_id text, p_provider_status text, p_error_code text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  v_safe_error text := CASE WHEN p_error_code ~ '^[A-Za-z0-9_.-]{1,80}$' THEN p_error_code ELSE NULL END;
BEGIN
  IF p_provider_status NOT IN ('sent', 'delivered', 'read', 'failed') OR nullif(p_provider_message_id, '') IS NULL THEN
    RETURN;
  END IF;
  UPDATE private.order_contact_attempts
  SET status = p_provider_status,
      error_code = coalesce(v_safe_error, error_code),
      completed_at = CASE WHEN p_provider_status IN ('delivered', 'read', 'failed') THEN now() ELSE completed_at END
  WHERE provider_message_id = p_provider_message_id;

  UPDATE private.order_contact_events e
  SET provider_status = CASE
        WHEN e.provider_status = 'read' THEN 'read'
        WHEN e.provider_status = 'delivered' AND p_provider_status = 'sent' THEN 'delivered'
        ELSE p_provider_status
      END,
      contact_status = CASE
        WHEN a.message_kind <> 'initial' THEN e.contact_status
        WHEN e.contact_status IN ('confirmed', 'cancelled', 'opted_out') THEN e.contact_status
        WHEN p_provider_status = 'failed' THEN 'failed'
        WHEN p_provider_status = 'read' THEN 'read'
        WHEN p_provider_status = 'delivered' AND e.contact_status <> 'read' THEN 'delivered'
        WHEN p_provider_status = 'sent' AND e.contact_status NOT IN ('delivered', 'read') THEN 'sent'
        ELSE e.contact_status
      END,
      last_error_code = CASE WHEN p_provider_status = 'failed' THEN coalesce(v_safe_error, 'provider_delivery_failed') ELSE e.last_error_code END,
      next_attempt_at = NULL,
      lease_until = NULL,
      updated_at = now()
  FROM private.order_contact_attempts a
  WHERE a.event_id = e.id
    AND a.provider_message_id = p_provider_message_id
    AND ((a.message_kind = 'initial' AND e.provider_message_id = p_provider_message_id)
      OR (a.message_kind = 'result' AND e.result_provider_message_id = p_provider_message_id));

  UPDATE private.order_contact_events
  SET result_notice_status = CASE WHEN p_provider_status = 'failed' THEN 'failed' ELSE result_notice_status END,
      result_last_error_code = CASE WHEN p_provider_status = 'failed' THEN coalesce(v_safe_error, 'provider_delivery_failed') ELSE result_last_error_code END,
      updated_at = now()
  WHERE result_provider_message_id = p_provider_message_id;
END;
$$;
REVOKE ALL ON FUNCTION public.update_order_contact_delivery(text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_order_contact_delivery(text, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.sweep_order_contact_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
BEGIN
  UPDATE private.order_contact_events
  SET contact_status = 'failed',
      last_error_code = 'dispatch_lease_expired_uncertain',
      lease_until = NULL, next_attempt_at = NULL, updated_at = now()
  WHERE contact_status = 'sending' AND lease_until < now();

  UPDATE private.order_contact_events
  SET result_notice_status = 'failed',
      result_last_error_code = 'dispatch_lease_expired_uncertain',
      lease_until = NULL, updated_at = now()
  WHERE result_notice_status = 'sending' AND lease_until < now();

  UPDATE private.order_contact_attempts
  SET status = 'unknown', error_code = 'dispatch_lease_expired_uncertain', completed_at = now()
  WHERE status = 'sending' AND attempted_at < now() - interval '5 minutes';

  UPDATE private.order_contact_events
  SET contact_status = 'no_response', updated_at = now()
  WHERE contact_status IN ('sent', 'delivered', 'read')
    AND response_deadline_at IS NOT NULL AND response_deadline_at <= now();
END;
$$;
REVOKE ALL ON FUNCTION public.sweep_order_contact_events() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sweep_order_contact_events() TO service_role;

CREATE OR REPLACE FUNCTION public.request_order_contact_retry(p_event_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  v_event private.order_contact_events%ROWTYPE;
  v_order_status text;
  v_phone text;
BEGIN
  SELECT e, o.status, private.normalize_egypt_phone(o.phone)
  INTO v_event, v_order_status, v_phone
  FROM private.order_contact_events e
  JOIN public.orders o ON o.id = e.order_id
  WHERE e.id = p_event_id
  FOR UPDATE OF e;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'reason', 'not_found'); END IF;
  IF EXISTS (SELECT 1 FROM private.order_contact_suppressions s WHERE s.phone_e164 = v_phone) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'opted_out');
  END IF;

  IF v_event.contact_status IN ('failed', 'no_response')
     AND v_order_status = 'PENDING'
     AND v_event.consent_at IS NOT NULL
     AND v_event.attempt_count < v_event.max_attempts
     AND coalesce(v_event.last_error_code, '') NOT IN ('provider_timeout_uncertain', 'dispatch_lease_expired_uncertain') THEN
    UPDATE private.order_contact_events
    SET contact_status = 'queued', next_attempt_at = now(), lease_until = NULL,
        last_error_code = NULL, updated_at = now()
    WHERE id = p_event_id;
    RETURN jsonb_build_object('success', true, 'queued', true, 'kind', 'initial');
  END IF;

  IF v_event.result_notice_status = 'failed'
     AND v_order_status IN ('CONFIRMED', 'CANCELLED')
     AND v_event.result_attempt_count < v_event.max_attempts
     AND coalesce(v_event.result_last_error_code, '') NOT IN ('provider_timeout_uncertain', 'dispatch_lease_expired_uncertain') THEN
    UPDATE private.order_contact_events
    SET result_notice_status = 'queued', lease_until = NULL,
        result_last_error_code = NULL, updated_at = now()
    WHERE id = p_event_id;
    RETURN jsonb_build_object('success', true, 'queued', true, 'kind', 'result');
  END IF;
  RETURN jsonb_build_object('success', false, 'reason', 'not_retryable');
END;
$$;
REVOKE ALL ON FUNCTION public.request_order_contact_retry(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.request_order_contact_retry(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.admin_list_order_contact_history(
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  event_id uuid,
  order_id uuid,
  order_number text,
  order_status text,
  contact_status text,
  result_notice_status text,
  attempt_count integer,
  max_attempts integer,
  result_attempt_count integer,
  last_attempt_at timestamptz,
  response_deadline_at timestamptz,
  last_error_code text,
  result_last_error_code text,
  updated_at timestamptz,
  attempts jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
  SELECT e.id,
         e.order_id,
         o.order_number::text,
         o.status::text,
         e.contact_status,
         e.result_notice_status,
         e.attempt_count,
         e.max_attempts,
         e.result_attempt_count,
         e.last_attempt_at,
         e.response_deadline_at,
         e.last_error_code,
         e.result_last_error_code,
         e.updated_at,
         coalesce(
           jsonb_agg(jsonb_build_object(
             'kind', a.message_kind,
             'attempt', a.attempt_number,
             'status', a.status,
             'error_code', a.error_code,
             'attempted_at', a.attempted_at,
             'completed_at', a.completed_at
           ) ORDER BY a.attempted_at) FILTER (WHERE a.id IS NOT NULL),
           '[]'::jsonb
         )
  FROM private.order_contact_events e
  JOIN public.orders o ON o.id = e.order_id
  LEFT JOIN private.order_contact_attempts a ON a.event_id = e.id
  GROUP BY e.id, o.id
  ORDER BY e.updated_at DESC
  LIMIT least(greatest(coalesce(p_limit, 50), 1), 100)
  OFFSET greatest(coalesce(p_offset, 0), 0);
$$;
REVOKE ALL ON FUNCTION public.admin_list_order_contact_history(integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_order_contact_history(integer, integer) TO service_role;

-- A per-project random worker token is stored only in Vault. The Edge Function
-- compares incoming cron calls through verify_order_contact_cron_token();
-- neither the browser nor repository ever receives the value.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'sen_order_contact_cron_token') THEN
    PERFORM vault.create_secret(
      replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
      'sen_order_contact_cron_token',
      'Private authentication token for the SÈN order contact worker'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'sen_order_contact_project_url') THEN
    PERFORM vault.create_secret(
      'https://xmjpwetwdznvnuzmhtiq.supabase.co',
      'sen_order_contact_project_url',
      'Supabase API URL for the SÈN order contact worker'
    );
  END IF;
END;
$$;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net;
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

DO $$
DECLARE
  v_job_id bigint;
BEGIN
  FOR v_job_id IN SELECT jobid FROM cron.job WHERE jobname = 'sen-order-contact-dispatch' LOOP
    PERFORM cron.unschedule(v_job_id);
  END LOOP;
  PERFORM cron.schedule(
    'sen-order-contact-dispatch',
    '* * * * *',
    $job$
      SELECT net.http_post(
        url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'sen_order_contact_project_url' LIMIT 1)
               || '/functions/v1/order-contact-dispatch',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-sen-cron-token', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'sen_order_contact_cron_token' LIMIT 1)
        ),
        body := '{"action":"process"}'::jsonb,
        timeout_milliseconds := 5000
      );
    $job$
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
