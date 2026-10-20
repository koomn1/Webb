-- SÈN Parfums: secure public checkout and admin-only order access
-- This migration preserves existing rows and moves checkout calculations into a
-- SECURITY DEFINER function. Apply after the existing schema migrations.

CREATE OR REPLACE FUNCTION public.is_order_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$;

REVOKE ALL ON FUNCTION public.is_order_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_order_admin() TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public order placement" ON public.orders;
DROP POLICY IF EXISTS "Allow read orders" ON public.orders;
DROP POLICY IF EXISTS "Allow update orders status" ON public.orders;

CREATE POLICY "Admins can read orders"
ON public.orders FOR SELECT
USING (public.is_order_admin());

CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
USING (public.is_order_admin())
WITH CHECK (public.is_order_admin());

REVOKE INSERT, SELECT, UPDATE, DELETE ON public.orders FROM anon, authenticated;

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
  v_item jsonb;
  v_product public.products%ROWTYPE;
  v_quantity integer;
  v_subtotal numeric(10,2) := 0;
  v_shipping numeric(10,2);
  v_discount numeric(10,2) := 0;
  v_total numeric(10,2);
  v_has_duo boolean := false;
  v_code public.discount_codes%ROWTYPE;
  v_order public.orders;
  v_items jsonb := '[]'::jsonb;
  v_order_number text;
BEGIN
  IF length(trim(coalesce(p_customer_name, ''))) < 3 THEN
    RAISE EXCEPTION 'الاسم الكامل يجب أن لا يقل عن 3 أحرف' USING ERRCODE = '22023';
  END IF;
  IF p_phone !~ '^01[0125][0-9]{8}$' THEN
    RAISE EXCEPTION 'رقم الموبايل المصري غير صحيح' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM (VALUES
    ('القاهرة',40::numeric), ('الجيزة',40::numeric), ('الإسكندرية',45::numeric),
    ('القليوبية',45::numeric), ('الشرقية',50::numeric), ('الدقهلية (المنصورة)',50::numeric),
    ('الغربية (طنطا)',50::numeric), ('المنوفية',50::numeric), ('البحيرة',50::numeric),
    ('كفر الشيخ',50::numeric), ('دمياط',50::numeric), ('بورسعيد',55::numeric),
    ('الإسماعيلية',55::numeric), ('السويس',55::numeric), ('بني سويف',60::numeric),
    ('الفيوم',60::numeric), ('المنيا',65::numeric), ('أسيوط',70::numeric),
    ('سوهاج',75::numeric), ('قنا',80::numeric), ('الأقصر',85::numeric),
    ('أسوان',90::numeric), ('البحر الأحمر',90::numeric), ('جنوب سيناء',90::numeric)
  ) AS g(name, fee) WHERE g.name = trim(p_governorate)) THEN
    RAISE EXCEPTION 'المحافظة غير مدعومة' USING ERRCODE = '22023';
  END IF;
  IF length(trim(coalesce(p_address, ''))) < 6 THEN
    RAISE EXCEPTION 'يرجى كتابة العنوان التفصيلي' USING ERRCODE = '22023';
  END IF;
  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'سلة المشتريات فارغة' USING ERRCODE = '22023';
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    v_quantity := (v_item->>'quantity')::integer;
    IF v_quantity < 1 OR v_quantity > 20 THEN
      RAISE EXCEPTION 'كمية المنتج غير صالحة' USING ERRCODE = '22023';
    END IF;

    SELECT * INTO v_product
    FROM public.products
    WHERE id = v_item->>'product_id' AND is_available = true;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'أحد المنتجات لم يعد متاحاً' USING ERRCODE = '22023';
    END IF;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
    v_has_duo := v_has_duo OR v_product.id = 'sen-duo-bundle';
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'name', v_product.name_ar,
      'quantity', v_quantity,
      'price', v_product.price
    ));
  END LOOP;

  SELECT fee INTO v_shipping
  FROM (VALUES
    ('القاهرة',40::numeric), ('الجيزة',40::numeric), ('الإسكندرية',45::numeric),
    ('القليوبية',45::numeric), ('الشرقية',50::numeric), ('الدقهلية (المنصورة)',50::numeric),
    ('الغربية (طنطا)',50::numeric), ('المنوفية',50::numeric), ('البحيرة',50::numeric),
    ('كفر الشيخ',50::numeric), ('دمياط',50::numeric), ('بورسعيد',55::numeric),
    ('الإسماعيلية',55::numeric), ('السويس',55::numeric), ('بني سويف',60::numeric),
    ('الفيوم',60::numeric), ('المنيا',65::numeric), ('أسيوط',70::numeric),
    ('سوهاج',75::numeric), ('قنا',80::numeric), ('الأقصر',85::numeric),
    ('أسوان',90::numeric), ('البحر الأحمر',90::numeric), ('جنوب سيناء',90::numeric)
  ) AS g(name, fee) WHERE g.name = trim(p_governorate);
  IF v_has_duo OR v_subtotal >= 1000 THEN v_shipping := 0; END IF;

  IF nullif(trim(p_discount_code), '') IS NOT NULL THEN
    SELECT * INTO v_code FROM public.discount_codes
    WHERE upper(code) = upper(trim(p_discount_code))
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
    FOR UPDATE;
    IF NOT FOUND OR (v_code.max_uses IS NOT NULL AND v_code.current_uses >= v_code.max_uses)
      OR v_subtotal < v_code.min_order_amount THEN
      RAISE EXCEPTION 'كود الخصم غير صالح أو لا ينطبق على الطلب' USING ERRCODE = '22023';
    END IF;
    IF v_code.discount_type = 'PERCENTAGE' THEN
      v_discount := round(v_subtotal * v_code.discount_value / 100);
    ELSE
      v_discount := least(v_subtotal, v_code.discount_value);
    END IF;
    IF v_code.max_discount_amount IS NOT NULL THEN
      v_discount := least(v_discount, v_code.max_discount_amount);
    END IF;
    UPDATE public.discount_codes SET current_uses = current_uses + 1
    WHERE id = v_code.id;
  END IF;

  v_total := greatest(0, v_subtotal - v_discount) + v_shipping;
  v_order_number := 'SEN-' || lpad((floor(random() * 1000000))::int::text, 6, '0');

  INSERT INTO public.orders (
    order_number, customer_name, phone, governorate, address, notes, items,
    subtotal, shipping_fee, total_amount, discount_code, discount_amount,
    payment_method, status
  ) VALUES (
    v_order_number, trim(p_customer_name), p_phone, trim(p_governorate), trim(p_address),
    nullif(trim(coalesce(p_notes, '')), ''), v_items, v_subtotal, v_shipping, v_total,
    nullif(upper(trim(coalesce(p_discount_code, ''))), ''), v_discount, 'COD', 'PENDING'
  ) RETURNING * INTO v_order;

  RETURN v_order;
END;
$$;

REVOKE ALL ON FUNCTION public.create_order(text,text,text,text,text,jsonb,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(text,text,text,text,text,jsonb,text) TO anon, authenticated;

-- Profiles must not be a public directory. Users may read only their own profile;
-- the SECURITY DEFINER admin check above can still inspect it.
DROP POLICY IF EXISTS "Users can read all profiles" ON public.profiles;
CREATE POLICY "Users can read their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Existing historical orders remain untouched. Direct client inserts/updates are
-- intentionally blocked; admin updates continue through authenticated RLS.
