-- Remove table-level privileges that bypass row-level policies.
-- Keep only the minimum DML needed by storefront and authenticated admins.

REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.orders, public.profiles, public.products, public.discount_codes, public.active_visitors FROM anon, authenticated;

REVOKE INSERT, DELETE, UPDATE, SELECT ON public.orders FROM anon;
GRANT SELECT, UPDATE ON public.orders TO authenticated;

REVOKE SELECT, INSERT, DELETE, UPDATE ON public.profiles FROM anon;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

REVOKE INSERT, UPDATE, DELETE ON public.products FROM anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;

REVOKE INSERT, UPDATE, DELETE ON public.discount_codes FROM anon;
GRANT SELECT ON public.discount_codes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discount_codes TO authenticated;

GRANT SELECT, INSERT, UPDATE ON public.active_visitors TO anon, authenticated;
REVOKE DELETE ON public.active_visitors FROM anon, authenticated;
