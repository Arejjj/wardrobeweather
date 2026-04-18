-- Migration: add gender and tags columns to wardrobe_items
-- Run this once in the Supabase SQL Editor for your project.

ALTER TABLE public.wardrobe_items
  ADD COLUMN IF NOT EXISTS gender text NOT NULL DEFAULT 'all',
  ADD COLUMN IF NOT EXISTS tags   text[] NOT NULL DEFAULT '{}';

-- Backfill existing rows: they were seeded without gender/tags,
-- so defaults ('all' and '{}') are correct — no extra update needed.
