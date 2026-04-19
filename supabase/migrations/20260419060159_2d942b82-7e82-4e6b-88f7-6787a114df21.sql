-- Drop the local addresses table; billing/shipping now live upstream on the CSP profile
DROP TABLE IF EXISTS public.addresses CASCADE;