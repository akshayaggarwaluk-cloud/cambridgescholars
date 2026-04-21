
-- Replace the overly-broad INSERT policies with role-scoped versions
-- that also enforce minimum field validity. Reads/updates/deletes stay
-- admin-only (handled by the cms-admin edge function with service role).

DROP POLICY IF EXISTS "Anyone can submit contact form"
  ON public.cms_contact_submissions;
CREATE POLICY "Public can submit contact form"
  ON public.cms_contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name))    BETWEEN 1 AND 200
    AND length(trim(email)) BETWEEN 3 AND 320
    AND email LIKE '%_@_%.__%'
    AND length(trim(message)) BETWEEN 1 AND 5000
    AND status = 'new'
    AND admin_notes IS NULL
  );

DROP POLICY IF EXISTS "Anyone can submit a proposal"
  ON public.cms_proposal_submissions;
CREATE POLICY "Public can submit a proposal"
  ON public.cms_proposal_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(author_name))  BETWEEN 1 AND 200
    AND length(trim(author_email)) BETWEEN 3 AND 320
    AND author_email LIKE '%_@_%.__%'
    AND status = 'new'
    AND admin_notes IS NULL
  );
