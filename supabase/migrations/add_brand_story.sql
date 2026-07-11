-- Add brand_story JSONB column to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS brand_story JSONB;
