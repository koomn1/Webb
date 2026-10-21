-- Fix discount-code management for every configured super-admin account.
-- This database uses profiles.created_at but has no profiles.updated_at column.
-- Existing auth users are promoted as well as users created after this migration.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    CASE
      WHEN lower(trim(NEW.email)) IN (
        'yo01009950871@gmail.com',
        'youssefbadawy5002@gmail.com'
      ) THEN 'super_admin'
      ELSE 'customer'
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url,
      role = CASE
        WHEN lower(trim(EXCLUDED.email)) IN (
          'yo01009950871@gmail.com',
          'youssefbadawy5002@gmail.com'
        ) THEN 'super_admin'
        ELSE public.profiles.role
      END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Repair existing admin accounts, including accounts created before profiles existed.
INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
  COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', ''),
  'super_admin'
FROM auth.users
WHERE lower(trim(email)) IN (
  'yo01009950871@gmail.com',
  'youssefbadawy5002@gmail.com'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    role = 'super_admin';
