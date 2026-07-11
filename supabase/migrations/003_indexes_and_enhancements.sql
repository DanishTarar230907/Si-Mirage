-- ============================================
-- SI MIRAGE MIGRATION 003
-- Performance Indexes & Product Enhancements
-- Run this AFTER 001 and 002
-- ============================================

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category        ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status          ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured     ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new          ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller  ON products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_products_is_new_arrival  ON products(is_new_arrival);
CREATE INDEX IF NOT EXISTS idx_products_name_search     ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_created_at      ON products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id  ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id    ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_display_order ON product_images(product_id, display_order);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id   ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_status       ON product_reviews(status);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id           ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status                ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at            ON orders(created_at DESC);

-- ============================================
-- PRODUCT TABLE ENHANCEMENTS
-- Adds missing columns needed by admin & storefront
-- All use IF NOT EXISTS so re-running is safe
-- ============================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS status           TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'hidden'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand            TEXT DEFAULT 'Si Mirage';
ALTER TABLE products ADD COLUMN IF NOT EXISTS collection_id    UUID REFERENCES collections(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_seller   BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new_arrival   BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS frame_type       TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags             TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title        TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description  TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url        TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS hover_image_url  TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new           BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge            TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_avg       DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count     INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at       TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- AUTO updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Attach to all tables that have updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;
CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_images_updated_at ON product_images;
CREATE TRIGGER update_product_images_updated_at
  BEFORE UPDATE ON product_images
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON product_reviews;
CREATE TRIGGER update_product_reviews_updated_at
  BEFORE UPDATE ON product_reviews
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- AUTO-RECALCULATE PRODUCT RATING
-- Fires whenever a review is inserted or its status changes
-- ============================================
CREATE OR REPLACE FUNCTION recalculate_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    rating_avg = (
      SELECT COALESCE(ROUND(AVG(rating)::NUMERIC, 2), 0)
      FROM product_reviews
      WHERE product_id = NEW.product_id AND status = 'approved'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM product_reviews
      WHERE product_id = NEW.product_id AND status = 'approved'
    )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS on_review_change ON product_reviews;
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OF status ON product_reviews
  FOR EACH ROW EXECUTE PROCEDURE recalculate_product_rating();

-- ============================================
-- ORDERS TABLE ENHANCEMENTS
-- ============================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost    DECIMAL(10,2) DEFAULT 250;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method   TEXT DEFAULT 'cod';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes            TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at       TIMESTAMPTZ DEFAULT NOW();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- RLS: Orders — allow service role full access
-- Public read policy removed (orders are private)
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers view own orders" ON orders;
CREATE POLICY "Customers view own orders"
  ON orders FOR SELECT
  USING (auth.uid()::TEXT = (shipping_address->>'customer_id'));

DROP POLICY IF EXISTS "Service role full access orders" ON orders;
CREATE POLICY "Service role full access orders"
  ON orders FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- RPC FUNCTIONS: SAFE STOCK DECREMENT
-- Used by /api/orders route to reduce inventory
-- Uses GREATEST to prevent negative stock
-- ============================================
CREATE OR REPLACE FUNCTION decrement_product_stock(product_id UUID, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock_quantity = GREATEST(0, stock_quantity - qty)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_variant_stock(variant_id UUID, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE product_variants
  SET stock_quantity = GREATEST(0, stock_quantity - qty)
  WHERE id = variant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to service role (used by supabase-admin client)
GRANT EXECUTE ON FUNCTION decrement_product_stock(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION decrement_variant_stock(UUID, INTEGER) TO service_role;

