-- ============================================
-- SI MIRAGE CMS MIGRATION 001
-- Creates all CMS tables for Admin Dashboard
-- Run in Supabase SQL Editor when ready
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extend products table with missing CMS columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS hover_image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Hero Slides
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cta1_text TEXT DEFAULT 'Shop Collection',
  cta1_link TEXT DEFAULT '/shop',
  cta2_text TEXT DEFAULT 'Explore',
  cta2_link TEXT DEFAULT '/collections',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collections
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creative Showcases
CREATE TABLE IF NOT EXISTS creative_showcases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cover_image TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT NOT NULL DEFAULT 'medium',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Showcases
CREATE TABLE IF NOT EXISTS media_showcases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cover_image TEXT NOT NULL,
  video_url TEXT,
  type TEXT NOT NULL DEFAULT 'Square',
  layout TEXT NOT NULL DEFAULT '1:1',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  avatar_url TEXT,
  review TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery (Instagram / Masonry)
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings (singleton)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT DEFAULT 'Si Mirage',
  logo_url TEXT DEFAULT '/logo.png',
  seo_title TEXT DEFAULT 'Si Mirage – Premium Luxury Eyewear',
  seo_description TEXT DEFAULT 'Cinematic sunglasses crafted with precision and style.',
  social_instagram TEXT DEFAULT '@simirage.official',
  newsletter_heading TEXT DEFAULT 'THE INSIDER',
  newsletter_description TEXT DEFAULT 'Subscribe to receive early access to new collections.',
  page_layouts JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_showcases ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_showcases ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read collections" ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "Public read creative_showcases" ON creative_showcases FOR SELECT USING (status = 'published');
CREATE POLICY "Public read media_showcases" ON media_showcases FOR SELECT USING (status = 'published');
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gallery_items" ON gallery_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Admin full access policies (development - tighten for production)
CREATE POLICY "Admin write hero_slides" ON hero_slides FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write collections" ON collections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write creative_showcases" ON creative_showcases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write media_showcases" ON media_showcases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write gallery_items" ON gallery_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write orders" ON orders FOR ALL USING (true) WITH CHECK (true);

-- Insert default site settings row
INSERT INTO site_settings (brand_name) VALUES ('Si Mirage') ON CONFLICT DO NOTHING;
