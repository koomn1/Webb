-- Keep the admin helper out of the exposed public API schema.
-- The checkout RPC remains public by design for guest purchases.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated;

CREATE OR REPLACE FUNCTION private.is_order_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$;

REVOKE ALL ON FUNCTION private.is_order_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_order_admin() TO anon, authenticated;

DROP POLICY IF EXISTS "Admins can read orders" ON public.orders;
CREATE POLICY "Admins can read orders"
ON public.orders FOR SELECT
USING (private.is_order_admin());

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
USING (private.is_order_admin())
WITH CHECK (private.is_order_admin());

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
USING (private.is_order_admin())
WITH CHECK (private.is_order_admin());

DROP POLICY IF EXISTS "Admins can manage discount codes" ON public.discount_codes;
CREATE POLICY "Admins can manage discount codes"
ON public.discount_codes FOR ALL
USING (private.is_order_admin())
WITH CHECK (private.is_order_admin());

DROP FUNCTION IF EXISTS public.is_order_admin();
