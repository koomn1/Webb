-- Harden remaining public-table policies found during the RLS audit.

-- Products are public-read, but only admins may manage them.
DROP POLICY IF EXISTS "Allow admin manage products" ON public.products;
CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
USING (public.is_order_admin())
WITH CHECK (public.is_order_admin());

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
ON public.products FROM anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;

-- Discount codes are public-read for checkout; writes are admin-only.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
ON public.discount_codes FROM anon;
GRANT SELECT ON public.discount_codes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discount_codes TO authenticated;

-- A profile owner can read their own profile. Profile creation is performed by
-- the auth trigger; do not allow clients to self-assign admin roles.
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Customers can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id AND role = 'customer')
WITH CHECK (auth.uid() = id AND role = 'customer');
REVOKE INSERT, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.profiles FROM anon, authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
REVOKE UPDATE ON public.profiles FROM anon;

-- Visitor presence needs public insert/update/select for the storefront, but
-- clients must not be able to delete all presence rows.
DROP POLICY IF EXISTS "Allow public heartbeat updates" ON public.active_visitors;
CREATE POLICY "Public can read visitor presence"
ON public.active_visitors FOR SELECT
USING (true);
CREATE POLICY "Public can create visitor presence"
ON public.active_visitors FOR INSERT
WITH CHECK (true);
CREATE POLICY "Public can update visitor presence"
ON public.active_visitors FOR UPDATE
USING (true)
WITH CHECK (true);
REVOKE DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.active_visitors FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.active_visitors TO anon, authenticated;
