-- ============================================
-- SI MIRAGE MIGRATION 002
-- Phase 1: Core Product System Expansion
-- ============================================

-- PRODUCT IMAGES
-- Stores gallery images for the product detail page
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT VARIANTS
-- Stores different versions of a product (e.g. colors, sizes, lenses)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE,
  name TEXT NOT NULL, -- e.g. "Matte Black / Polarized"
  color TEXT,
  size TEXT,
  material TEXT,
  lens_type TEXT,
  price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT REVIEWS
-- Stores customer reviews for products
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID, -- Optional foreign key if linking to a customers/users table
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT ADDITIONAL FIELDS
-- Add new fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;

-- ENABLE RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
DROP POLICY IF EXISTS "Public read product_images" ON product_images;
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read product_variants" ON product_variants;
CREATE POLICY "Public read product_variants" ON product_variants FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read product_reviews" ON product_reviews;
CREATE POLICY "Public read product_reviews" ON product_reviews FOR SELECT USING (status = 'approved');

-- ADMIN WRITE POLICIES
DROP POLICY IF EXISTS "Admin write product_images" ON product_images;
CREATE POLICY "Admin write product_images" ON product_images FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write product_variants" ON product_variants;
CREATE POLICY "Admin write product_variants" ON product_variants FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write product_reviews" ON product_reviews;
CREATE POLICY "Admin write product_reviews" ON product_reviews FOR ALL USING (true) WITH CHECK (true);
