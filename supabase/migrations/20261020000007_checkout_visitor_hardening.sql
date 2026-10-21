-- Harden guest checkout, visitor presence, and discount data without deleting existing orders.

-- Shoppers validate one code at a time; only admins can enumerate the coupon table.
DROP POLICY IF EXISTS "Allow public read active discount codes" ON public.discount_codes;
DROP POLICY IF EXISTS "Public can read active discount codes" ON public.discount_codes;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'discount_codes_code_format_check') THEN
    ALTER TABLE public.discount_codes
      ADD CONSTRAINT discount_codes_code_format_check
      CHECK (code = upper(trim(code)) AND code ~ '^[A-Z0-9][A-Z0-9_-]{1,31}$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'discount_codes_value_check') THEN
    ALTER TABLE public.discount_codes
      ADD CONSTRAINT discount_codes_value_check
      CHECK (
        (discount_type = 'PERCENTAGE' AND discount_value > 0 AND discount_value <= 100)
        OR (discount_type = 'FIXED' AND discount_value > 0)
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'discount_codes_minimum_check') THEN
    ALTER TABLE public.discount_codes
      ADD CONSTRAINT discount_codes_minimum_check
      CHECK (min_order_amount >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'discount_codes_usage_check') THEN
    ALTER TABLE public.discount_codes
      ADD CONSTRAINT discount_codes_usage_check
      CHECK (current_uses >= 0 AND (max_uses IS NULL OR max_uses >= 1));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'discount_codes_max_discount_check') THEN
    ALTER TABLE public.discount_codes
      ADD CONSTRAINT discount_codes_max_discount_check
      CHECK (max_discount_amount IS NULL OR max_discount_amount > 0);
  END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_discount_codes_normalized_code
  ON public.discount_codes (upper(trim(code)));

CREATE OR REPLACE FUNCTION public.validate_discount_code(
  p_code text,
  p_subtotal numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code public.discount_codes%ROWTYPE;
  v_discount numeric(10,2);
BEGIN
  IF nullif(trim(coalesce(p_code, '')), '') IS NULL
     OR length(trim(p_code)) > 32
     OR p_subtotal IS NULL
     OR p_subtotal < 0
     OR p_subtotal > 1000000
     OR p_subtotal::text IN ('NaN', 'Infinity', '-Infinity') THEN
    RETURN jsonb_build_object('success', false, 'message', 'كود الخصم غير صحيح أو انتهت صلاحيته.');
  END IF;

  SELECT * INTO v_code
  FROM public.discount_codes
  WHERE upper(code) = upper(trim(p_code))
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now());
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'كود الخصم غير صحيح أو انتهت صلاحيته.');
  END IF;
  IF v_code.max_uses IS NOT NULL AND v_code.current_uses >= v_code.max_uses THEN
    RETURN jsonb_build_object('success', false, 'message', 'كود الخصم استنفد عدد مرات الاستخدام المتاح.');
  END IF;
  IF p_subtotal < v_code.min_order_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', format('الحد الأدنى لتطبيق هذا الكود هو %s ج.م', v_code.min_order_amount)
    );
  END IF;

  IF v_code.discount_type = 'PERCENTAGE' THEN
    v_discount := round(p_subtotal * v_code.discount_value / 100);
  ELSE
    v_discount := least(p_subtotal, v_code.discount_value);
  END IF;
  IF v_code.max_discount_amount IS NOT NULL THEN
    v_discount := least(v_discount, v_code.max_discount_amount);
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', CASE WHEN v_code.discount_type = 'PERCENTAGE'
      THEN format('تم تطبيق كود (%s) بنجاح! خصم %s%%', v_code.code, v_code.discount_value)
      ELSE format('تم تطبيق كود (%s) بنجاح! خصم %s ج.م', v_code.code, v_code.discount_value)
    END,
    'code', v_code.code,
    'discount_type', v_code.discount_type,
    'discount_value', v_code.discount_value,
    'max_discount_amount', v_code.max_discount_amount,
    'discount_amount', v_discount
  );
END;
$$;
REVOKE ALL ON FUNCTION public.validate_discount_code(text, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_discount_code(text, numeric) TO anon, authenticated;

-- Public visitors can no longer enumerate or write raw presence rows.
DROP POLICY IF EXISTS "Allow public heartbeat updates" ON public.active_visitors;
DROP POLICY IF EXISTS "Public can read visitor presence" ON public.active_visitors;
DROP POLICY IF EXISTS "Public can create visitor presence" ON public.active_visitors;
DROP POLICY IF EXISTS "Public can update visitor presence" ON public.active_visitors;
DROP POLICY IF EXISTS "Admins can read visitor presence" ON public.active_visitors;
CREATE POLICY "Admins can read visitor presence"
ON public.active_visitors FOR SELECT
USING (private.is_order_admin());
REVOKE ALL ON public.active_visitors FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.active_visitors TO authenticated;

CREATE OR REPLACE FUNCTION public.record_visitor_heartbeat(
  p_session_id uuid,
  p_current_page text,
  p_device_type text DEFAULT 'Mobile'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_page text := trim(coalesce(p_current_page, '/'));
  v_device text := coalesce(p_device_type, 'Mobile');
BEGIN
  IF p_session_id IS NULL THEN
    RAISE EXCEPTION 'معرّف الجلسة غير صالح' USING ERRCODE = '22023';
  END IF;
  IF v_page = '' OR left(v_page, 1) <> '/' OR left(v_page, 2) = '//'
     OR length(v_page) > 200 OR v_page ~ '[[:cntrl:]]' THEN
    v_page := '/';
  END IF;
  IF v_device NOT IN ('Mobile', 'Tablet', 'Desktop') THEN
    v_device := 'Mobile';
  END IF;

  INSERT INTO public.active_visitors (session_id, current_page, device_type, last_heartbeat)
  VALUES (p_session_id::text, v_page, v_device, now())
  ON CONFLICT (session_id) DO UPDATE
    SET current_page = EXCLUDED.current_page,
        device_type = EXCLUDED.device_type,
        last_heartbeat = EXCLUDED.last_heartbeat
    WHERE public.active_visitors.last_heartbeat < now() - interval '30 seconds'
       OR public.active_visitors.current_page IS DISTINCT FROM EXCLUDED.current_page;

  -- Opportunistically remove stale session-only rows without a scheduled job.
  IF random() < 0.02 THEN
    DELETE FROM public.active_visitors
    WHERE last_heartbeat < now() - interval '48 hours';
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.record_visitor_heartbeat(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_visitor_heartbeat(uuid, text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_active_visitors_count()
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, private
AS $$
BEGIN
  IF NOT private.is_order_admin() THEN
    RAISE EXCEPTION 'غير مصرح' USING ERRCODE = '42501';
  END IF;
  RETURN (
    SELECT count(*)::integer
    FROM public.active_visitors
    WHERE last_heartbeat >= now() - interval '5 minutes'
  );
END;
$$;
REVOKE ALL ON FUNCTION public.get_active_visitors_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_active_visitors_count() TO authenticated;

-- Private, unguessable idempotency keys make network retries safe and do not expose an order list.
CREATE TABLE IF NOT EXISTS private.checkout_idempotency (
  idempotency_key uuid PRIMARY KEY,
  order_number text NOT NULL UNIQUE REFERENCES public.orders(order_number) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE private.checkout_idempotency ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.checkout_idempotency FROM PUBLIC, anon, authenticated;
CREATE INDEX IF NOT EXISTS idx_orders_phone_created_at
  ON public.orders (phone, created_at DESC);

CREATE OR REPLACE FUNCTION public.submit_checkout(
  p_customer_name text,
  p_phone text,
  p_governorate text,
  p_address text,
  p_notes text DEFAULT NULL,
  p_items jsonb DEFAULT '[]'::jsonb,
  p_discount_code text DEFAULT NULL,
  p_idempotency_key uuid DEFAULT NULL,
  p_website text DEFAULT NULL
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_existing_order_number text;
  v_attempt integer := 0;
  v_recent_orders integer;
BEGIN
  IF p_idempotency_key IS NULL THEN
    RAISE EXCEPTION 'تعذر التحقق من الطلب، أعد المحاولة' USING ERRCODE = '22023';
  END IF;
  IF nullif(trim(coalesce(p_website, '')), '') IS NOT NULL THEN
    RAISE EXCEPTION 'تعذر إرسال الطلب' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(p_idempotency_key::text, 0));

  SELECT order_number INTO v_existing_order_number
  FROM private.checkout_idempotency
  WHERE idempotency_key = p_idempotency_key;
  IF FOUND THEN
    SELECT * INTO v_order FROM public.orders WHERE order_number = v_existing_order_number;
    IF FOUND THEN RETURN v_order; END IF;
  END IF;

  IF length(trim(coalesce(p_customer_name, ''))) > 120
     OR length(trim(coalesce(p_address, ''))) > 500
     OR length(coalesce(p_notes, '')) > 500
     OR length(trim(coalesce(p_governorate, ''))) > 80 THEN
    RAISE EXCEPTION 'بعض بيانات الطلب أطول من الحد المسموح' USING ERRCODE = '22023';
  END IF;
  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'عدد المنتجات في الطلب غير صالح' USING ERRCODE = '22023';
  END IF;
  IF jsonb_array_length(p_items) < 1 OR jsonb_array_length(p_items) > 20 THEN
    RAISE EXCEPTION 'عدد المنتجات في الطلب غير صالح' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_items) AS line(item)
    WHERE coalesce(line.item ->> 'product_id', '') = ''
       OR CASE
            WHEN coalesce(line.item ->> 'quantity', '') ~ '^[0-9]{1,2}$'
              THEN (line.item ->> 'quantity')::integer NOT BETWEEN 1 AND 20
            ELSE true
          END
  ) THEN
    RAISE EXCEPTION 'كمية أحد المنتجات غير صالحة' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (
    SELECT line.item ->> 'product_id'
    FROM jsonb_array_elements(p_items) AS line(item)
    GROUP BY line.item ->> 'product_id'
    HAVING sum((line.item ->> 'quantity')::integer) > 20
  ) THEN
    RAISE EXCEPTION 'الحد الأقصى لكل منتج هو 20 قطعة' USING ERRCODE = '22023';
  END IF;

  -- Guest abuse guard: a phone number may submit at most five orders per ten minutes.
  -- Authenticated administrators may enter legitimate phone/WhatsApp orders without this cap.
  IF NOT private.is_order_admin() THEN
    PERFORM pg_advisory_xact_lock(hashtextextended(trim(p_phone), 1));
    SELECT count(*)::integer INTO v_recent_orders
    FROM public.orders
    WHERE phone = trim(p_phone)
      AND created_at >= now() - interval '10 minutes';
    IF v_recent_orders >= 5 THEN
      RAISE EXCEPTION 'تم استلام عدة طلبات من هذا الرقم مؤخراً. انتظر قليلاً ثم حاول مرة أخرى.'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  -- The legacy calculation routine remains the sole authority for prices, shipping, and discounts.
  -- The subtransaction lets us safely retry the extremely unlikely human order-number collision.
  LOOP
    v_attempt := v_attempt + 1;
    BEGIN
      v_order := private.create_order_legacy(
        p_customer_name, p_phone, p_governorate, p_address,
        nullif(trim(coalesce(p_notes, '')), ''), p_items, p_discount_code
      );
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      IF v_attempt >= 5 THEN RAISE; END IF;
    END;
  END LOOP;

  INSERT INTO private.checkout_idempotency (idempotency_key, order_number)
  VALUES (p_idempotency_key, v_order.order_number);
  RETURN v_order;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_checkout(text, text, text, text, text, jsonb, text, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_checkout(text, text, text, text, text, jsonb, text, uuid, text) TO anon, authenticated;

-- Preserve the legacy RPC name for the currently deployed frontend, but move the
-- pricing implementation out of the exposed schema and route every call through
-- the same validation/rate-limit path.
ALTER FUNCTION public.create_order(text, text, text, text, text, jsonb, text) SET SCHEMA private;
ALTER FUNCTION private.create_order(text, text, text, text, text, jsonb, text) RENAME TO create_order_legacy;
REVOKE ALL ON FUNCTION private.create_order_legacy(text, text, text, text, text, jsonb, text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_order(
  p_customer_name text,
  p_phone text,
  p_governorate text,
  p_address text,
  p_notes text DEFAULT NULL,
  p_items jsonb DEFAULT '[]'::jsonb,
  p_discount_code text DEFAULT NULL
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
BEGIN
  v_order := public.submit_checkout(
    p_customer_name, p_phone, p_governorate, p_address,
    p_notes, p_items, p_discount_code, gen_random_uuid(), NULL
  );
  RETURN v_order;
END;
$$;
REVOKE ALL ON FUNCTION public.create_order(text, text, text, text, text, jsonb, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, text, jsonb, text) TO anon, authenticated;
