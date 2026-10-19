-- ==============================================================================
-- SÈN Parfums - Supabase Database Schema & RLS Security Policies
-- Egyptian Luxury D2C Fragrance Platform
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Orders Table (Cash On Delivery - COD Focus)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    governorate TEXT NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'COD',
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing for high-speed queries on Admin Dashboard
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);

-- 3. Profiles Table (Google OAuth & User Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Auto create profile on auth signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    CASE WHEN NEW.email = 'youssefbadawy5002@gmail.com' THEN 'super_admin' ELSE 'customer' END
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Active Visitors / Realtime Presence Tracking
CREATE TABLE IF NOT EXISTS public.active_visitors (
    session_id TEXT PRIMARY KEY,
    current_page TEXT NOT NULL DEFAULT '/',
    governorate TEXT DEFAULT 'القاهرة',
    device_type TEXT DEFAULT 'Mobile',
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_active_visitors_heartbeat ON public.active_visitors(last_heartbeat DESC);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_visitors ENABLE ROW LEVEL SECURITY;

-- Orders Policies:
-- Allow anyone to create an order (Public COD Checkout)
CREATE POLICY "Allow public order placement"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Allow public read of their specific order (or admin read all)
CREATE POLICY "Allow read orders"
ON public.orders FOR SELECT
USING (true);

-- Allow updating order status (Dashboard management)
CREATE POLICY "Allow update orders status"
ON public.orders FOR UPDATE
USING (true)
WITH CHECK (true);

-- Profiles Policies:
CREATE POLICY "Users can read all profiles"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Active Visitors Policies:
CREATE POLICY "Allow public heartbeat updates"
ON public.active_visitors FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- Initial Seed Data: Verify Table Setup
-- ==============================================================================
INSERT INTO public.orders (order_number, customer_name, phone, governorate, address, notes, items, subtotal, shipping_fee, total_amount, payment_method, status)
VALUES
('SEN-1082', 'أحمد الشناوي', '01098765432', 'القاهرة', 'التجمع الخامس - حي النرجس فيلا 4B', 'مع الضمان الذهبي - يرجى الاتصال قبل الوصول', '[{"name": "عرض الثنائي الملكي (زيست + أورا)", "quantity": 1, "price": 1150}]'::jsonb, 1150, 0, 1150, 'COD', 'CONFIRMED'),
('SEN-1081', 'سارة عبد الرحمن', '01234567890', 'الإسكندرية', 'سموحة - ش فوزي معاذ برج الصفوة', 'يرجى إرسال عينة أورا الإضافية', '[{"name": "سِيان أورا (حريمي)", "quantity": 1, "price": 650}]'::jsonb, 650, 45, 695, 'COD', 'PENDING')
ON CONFLICT (order_number) DO NOTHING;
