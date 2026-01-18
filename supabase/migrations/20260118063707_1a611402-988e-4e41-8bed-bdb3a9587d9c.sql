-- Fix RLS policies for addresses table
-- Since we're using external auth, we need to use service role for API calls
-- and filter by user_id in the application layer

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can create their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;

-- Create new policies that allow all operations 
-- The actual user_id filtering will be done in the application layer
-- since we're using external auth, not Supabase auth
CREATE POLICY "Allow all select on addresses" 
ON public.addresses 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all insert on addresses" 
ON public.addresses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all update on addresses" 
ON public.addresses 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow all delete on addresses" 
ON public.addresses 
FOR DELETE 
USING (true);