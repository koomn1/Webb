-- Preserve the legacy aggregate metrics before removing unverified values from the public catalog.
CREATE TABLE IF NOT EXISTS private.product_social_metrics_archive (
  product_id TEXT PRIMARY KEY,
  old_concentration TEXT NOT NULL,
  old_rating NUMERIC,
  old_reviews_count INTEGER,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

REVOKE ALL ON TABLE private.product_social_metrics_archive FROM PUBLIC, anon, authenticated, service_role;

INSERT INTO private.product_social_metrics_archive (
  product_id,
  old_concentration,
  old_rating,
  old_reviews_count
)
SELECT id, concentration, rating, reviews_count
FROM public.products
ON CONFLICT (product_id) DO NOTHING;

ALTER TABLE public.products
  ALTER COLUMN concentration SET DEFAULT 'Eau de Parfum Intense',
  ALTER COLUMN rating DROP DEFAULT,
  ALTER COLUMN reviews_count SET DEFAULT 0;

UPDATE public.products
SET concentration = regexp_replace(
      concentration,
      'Extrait de Parfum',
      'Eau de Parfum Intense',
      'gi'
    ),
    rating = NULL,
    reviews_count = 0
WHERE concentration ILIKE '%Extrait de Parfum%'
   OR rating IS NOT NULL
   OR reviews_count IS DISTINCT FROM 0;

-- Store only customer-approved display fields; no phone numbers, emails, or account identifiers.
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL CHECK (char_length(btrim(product_name)) BETWEEN 1 AND 80),
  quote TEXT NOT NULL CHECK (char_length(btrim(quote)) BETWEEN 10 AND 800),
  reviewer_label TEXT NOT NULL CHECK (char_length(btrim(reviewer_label)) BETWEEN 2 AND 40),
  rating SMALLINT CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  consent_confirmed BOOLEAN NOT NULL DEFAULT false,
  consent_recorded_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT product_reviews_consent_timestamp_required
    CHECK (NOT consent_confirmed OR consent_recorded_at IS NOT NULL),
  CONSTRAINT product_reviews_publication_requires_consent
    CHECK (NOT is_published OR (consent_confirmed AND consent_recorded_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS product_reviews_public_feed_idx
  ON public.product_reviews (created_at DESC)
  WHERE consent_confirmed = true AND is_published = true;

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.product_reviews FROM PUBLIC, anon, authenticated;
GRANT SELECT (id, product_name, quote, reviewer_label, rating, created_at)
  ON TABLE public.product_reviews TO anon;
GRANT SELECT ON TABLE public.product_reviews TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.product_reviews TO authenticated;
GRANT ALL ON TABLE public.product_reviews TO service_role;

DROP POLICY IF EXISTS "Public can read approved product reviews" ON public.product_reviews;
CREATE POLICY "Public can read approved product reviews"
  ON public.product_reviews
  FOR SELECT
  TO anon, authenticated
  USING (consent_confirmed = true AND is_published = true);

DROP POLICY IF EXISTS "Admins can manage product reviews" ON public.product_reviews;
CREATE POLICY "Admins can manage product reviews"
  ON public.product_reviews
  FOR ALL
  TO authenticated
  USING (private.is_order_admin())
  WITH CHECK (private.is_order_admin());
