-- Restrict public catalog reads to products that are currently available.
-- Admins retain access to unavailable products through their existing RLS policy.
DROP POLICY IF EXISTS "Allow public read products" ON public.products;
CREATE POLICY "Allow public read products"
ON public.products
FOR SELECT
TO anon, authenticated
USING (is_available IS TRUE);

-- The deployed storefront now uses the idempotent submit_checkout RPCs.
-- Remove the unused legacy wrapper from public API roles.
REVOKE ALL ON FUNCTION public.create_order(text, text, text, text, text, jsonb, text)
FROM PUBLIC, anon, authenticated;

-- This helper is not a storefront RPC and has no active trigger dependency.
REVOKE ALL ON FUNCTION public.handle_new_user()
FROM PUBLIC, anon, authenticated;

-- Visitor count is used by the authenticated admin dashboard, not anonymous visitors.
REVOKE ALL ON FUNCTION public.get_active_visitors_count()
FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_active_visitors_count()
TO authenticated;
