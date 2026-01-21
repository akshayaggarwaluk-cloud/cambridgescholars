-- Drop all permissive policies on addresses table
DROP POLICY IF EXISTS "Allow all select on addresses" ON public.addresses;
DROP POLICY IF EXISTS "Allow all insert on addresses" ON public.addresses;
DROP POLICY IF EXISTS "Allow all update on addresses" ON public.addresses;
DROP POLICY IF EXISTS "Allow all delete on addresses" ON public.addresses;

-- Create explicit deny policies for direct access
-- All address operations MUST go through the manage-addresses edge function which uses service role key
CREATE POLICY "Deny direct select on addresses"
ON public.addresses
FOR SELECT
USING (false);

CREATE POLICY "Deny direct insert on addresses"
ON public.addresses
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Deny direct update on addresses"
ON public.addresses
FOR UPDATE
USING (false);

CREATE POLICY "Deny direct delete on addresses"
ON public.addresses
FOR DELETE
USING (false);