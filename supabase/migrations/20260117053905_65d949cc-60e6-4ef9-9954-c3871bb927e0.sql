-- Drop the overly permissive public profile access policy
DROP POLICY IF EXISTS "Anyone can view basic profile info for reviews" ON public.profiles;

-- Create a more restrictive policy that only allows viewing profiles for users who have written reviews
-- This prevents arbitrary enumeration of all user profiles while still allowing review display
CREATE POLICY "Users can view profiles of reviewers"
ON public.profiles
FOR SELECT
USING (
  -- Users can always see their own profile
  auth.uid() = id
  OR
  -- Can only see profiles of users who have written reviews (join context)
  EXISTS (
    SELECT 1 FROM public.reviews
    WHERE reviews.user_id = profiles.id
  )
);