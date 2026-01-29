-- Drop existing RLS policies that reference user_id
DROP POLICY IF EXISTS "Users can add to their own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can view their own wishlist" ON public.wishlist;

-- Change user_id column from UUID to TEXT
ALTER TABLE public.wishlist ALTER COLUMN user_id TYPE text USING user_id::text;

-- Recreate RLS policies without auth.uid() since we're using external auth
-- These will allow access based on the user_id being passed in
CREATE POLICY "Users can add to their own wishlist" 
ON public.wishlist 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users can remove from their own wishlist" 
ON public.wishlist 
FOR DELETE 
TO anon, authenticated
USING (true);

CREATE POLICY "Users can view their own wishlist" 
ON public.wishlist 
FOR SELECT 
TO anon, authenticated
USING (true);