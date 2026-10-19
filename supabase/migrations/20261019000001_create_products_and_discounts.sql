-- ==============================================================================
-- SÈN Haute Parfumerie - Products & Discount Codes Schema
-- Tables for Dynamic Product Catalog & Promotional Discount Engine
-- ==============================================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY, -- e.g. 'sen-zeste', 'sen-aura', 'sen-duo-bundle' or custom
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    tagline_ar TEXT,
    gender TEXT DEFAULT 'Unisex',
    gender_ar TEXT DEFAULT 'للجنسين',
    price NUMERIC(10, 2) NOT NULL DEFAULT 650.00,
    original_price NUMERIC(10, 2), -- Original price before discount for sale badges
    image TEXT NOT NULL,
    description_ar TEXT,
    volume_ml INTEGER NOT NULL DEFAULT 50,
    concentration TEXT NOT NULL DEFAULT 'Extrait de Parfum',
    top_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    heart_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    base_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    sillage TEXT NOT NULL DEFAULT 'فوحان استثنائي يمتد لأمتار',
    longevity TEXT NOT NULL DEFAULT 'ثبات يتجاوز 14 ساعة',
    badge TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 120,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing for fast search and display
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- 2. Discount Codes Table
CREATE TABLE IF NOT EXISTS public.discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    max_discount_amount NUMERIC(10, 2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    max_uses INTEGER,
    current_uses INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON public.discount_codes(is_active);

-- 3. Row Level Security Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Allow public read of available products
CREATE POLICY "Allow public read products"
ON public.products FOR SELECT
USING (true);

-- Allow admins to insert/update/delete products
CREATE POLICY "Allow admin manage products"
ON public.products FOR ALL
USING (true)
WITH CHECK (true);

-- Allow public read of active discount codes for verification at checkout
CREATE POLICY "Allow public read active discount codes"
ON public.discount_codes FOR SELECT
USING (true);

-- Allow admins to manage discount codes
CREATE POLICY "Allow admin manage discount codes"
ON public.discount_codes FOR ALL
USING (true)
WITH CHECK (true);

-- 4. Initial Seed for Products (Matches SÈN Brand)
INSERT INTO public.products (id, name, name_ar, tagline_ar, gender, gender_ar, price, original_price, image, description_ar, volume_ml, concentration, top_notes, heart_notes, base_notes, sillage, longevity, badge, rating, reviews_count, is_available)
VALUES
(
    'sen-zeste',
    'SÈN Zeste',
    'سِيان زيست (SÈN Zeste)',
    'سطوة الانتعاش الإيطالي ودفقات السكر المكرمل وأخشاب الأرز',
    'Men',
    'رجالي',
    650.00,
    750.00,
    '/images/zeste.webp',
    'صيغ SÈN Zeste للرجل الذي يترك أثراً مهيباً قبل أن يتحدث. افتتاحية تأسر الحواس من برغموت كابري واليوسفي الصقلي، تحتضن قلباً غنياً من السكر المكرمل وتوت العليق، وتستقر على قاعدة عميقة من الجلد المدبوغ وأخشاب الأرز والباتشولي النقي.',
    50,
    'Extrait de Parfum',
    '["برغموت إيطالي فاخر", "يوسفي صقلي نضر", "نفحات هواء البحر"]'::jsonb,
    '["سكر مكرمل دافئ", "توت العليق", "فلفل وردي مدغشقري"]'::jsonb,
    '["جلد مدبوغ معتق", "خشب الأرز الأطلسي", "باتشولي نقي"]'::jsonb,
    'فوحان هائل يملأ المكان',
    'ثبات يتجاوز 14 ساعة على الملابس',
    'الأكثر طلباً',
    4.9,
    148,
    true
),
(
    'sen-aura',
    'SÈN Aura',
    'سِيان أورا (SÈN Aura)',
    'سحر الأنوثة المخملية وتوت العليق الممزوج بالسوسن والمسك الأبيض',
    'Women',
    'نسائي',
    650.00,
    750.00,
    '/images/aura.webp',
    'تجسيد للأناقة الباريسية الهادئة والجاذبية التي لا تقاوم. يبدأ بنفحات حلوة مخملية من التفاح السكري والفواكه الحمراء النضرة، يتوسطه باقة ساحرة من زهور السوسن والياسمين، وتختتمه قاعدة دافئة من الفانيليا المدغشقرية وخشب الصندل والمسك الأبيض.',
    50,
    'Extrait de Parfum',
    '["تفاح سكري ناعم", "فواكه حمراء فرنسية", "خوخ أبيض"]'::jsonb,
    '["زهور السوسن المخملية", "ياسمين سامباك", "ورد طائفي نقي"]'::jsonb,
    '["فانيليا مدغشقرية", "خشب الصندل السريلانكي", "مسك أبيض حريري"]'::jsonb,
    'فوحان ناعم وجذاب',
    'ثبات يتجاوز 14 ساعة على البشرة والملابس',
    'إصدار حصري',
    4.9,
    132,
    true
),
(
    'sen-duo-bundle',
    'SÈN Duo Royal Bundle',
    'باقة الثنائي الملكية (Zeste & Aura)',
    'التناغم العطري الأرقى • عطران فاخران + شحن مجاني + عينات التجربة',
    'Duo',
    'باقة الثنائي',
    1150.00,
    1300.00,
    '/images/duo_bundle.webp',
    'الباقة الأيقونية التي تجمع بين سحر الشرق وأناقة باريس. زجاجة 50 مل من SÈN Zeste الرجالي + زجاجة 50 مل من SÈN Aura النسائي، مع عينتين استكشافيتين 2 مل مجاناً وميثاق الثقة والأمان، وتوصيل مجاني لكافة محافظات مصر.',
    100,
    'Extrait de Parfum (2 × 50ml)',
    '["برغموت إيطالي وتفاح سكري مخملي"]'::jsonb,
    '["سكر مكرمل وزهور السوسن البيضاء"]'::jsonb,
    '["جلد مدبوغ وفانيليا وخشب الأرز والمسك"]'::jsonb,
    'حضور استثنائي متكامل',
    'ثبات ممتد على مدار اليوم',
    'وفر 150 ج.م + شحن مجاني',
    5.0,
    215,
    true
)
ON CONFLICT (id) DO UPDATE
SET price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    updated_at = timezone('utc'::text, now());

-- 5. Initial Seed for Discount Codes
INSERT INTO public.discount_codes (code, discount_type, discount_value, min_order_amount, is_active, max_uses)
VALUES
('SEN10', 'PERCENTAGE', 10.00, 500.00, true, 500),
('VIP50', 'FIXED', 50.00, 600.00, true, 200),
('ROYAL15', 'PERCENTAGE', 15.00, 1000.00, true, 100)
ON CONFLICT (code) DO NOTHING;
