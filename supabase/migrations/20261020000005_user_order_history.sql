-- Attach future orders to the authenticated customer without exposing guest orders.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_user_id_created_at
  ON public.orders(user_id, created_at DESC);

CREATE OR REPLACE FUNCTION private.attach_order_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
BEGIN
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.attach_order_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.attach_order_user() TO anon, authenticated;

DROP TRIGGER IF EXISTS orders_attach_user ON public.orders;
CREATE TRIGGER orders_attach_user
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION private.attach_order_user();

DROP POLICY IF EXISTS "Customers can read their own orders" ON public.orders;
CREATE POLICY "Customers can read their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);
