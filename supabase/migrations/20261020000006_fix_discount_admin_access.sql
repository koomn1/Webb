-- Fix discount-code management for every configured super-admin account.
-- The previous trigger promoted only one of the two configured admin emails,
-- which caused Supabase RLS to reject create/update/delete requests.

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
      avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Repair profiles that were created before the corrected trigger was applied.
UPDATE public.profiles
SET role = 'super_admin', updated_at = timezone('utc'::text, now())
WHERE lower(trim(email)) IN (
  'yo01009950871@gmail.com',
  'youssefbadawy5002@gmail.com'
)
AND role <> 'super_admin';
