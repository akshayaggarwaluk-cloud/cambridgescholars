-- Fix 1: Add format column to cart_items table for proper book format tracking
ALTER TABLE public.cart_items ADD COLUMN IF NOT EXISTS format text NOT NULL DEFAULT 'hardbook';

-- Drop the existing unique constraint
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_book_id_key;

-- Create new unique constraint including format
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_user_id_book_id_format_key UNIQUE (user_id, book_id, format);

-- Fix 2: Allow public access to basic profile info for review display (reviewer names)
-- This is common for review platforms where reviewer identity builds trust
CREATE POLICY "Anyone can view basic profile info for reviews"
  ON public.profiles
  FOR SELECT
  USING (true);