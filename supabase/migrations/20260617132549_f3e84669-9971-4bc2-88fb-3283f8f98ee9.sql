
CREATE TABLE public.cms_policy_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cms_policy_pages TO anon;
GRANT SELECT ON public.cms_policy_pages TO authenticated;
GRANT ALL ON public.cms_policy_pages TO service_role;

ALTER TABLE public.cms_policy_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read policy pages"
ON public.cms_policy_pages FOR SELECT
USING (true);

INSERT INTO public.cms_policy_pages (slug, title) VALUES
  ('privacy-policy', 'Privacy Policy'),
  ('cookies-policy', 'Cookies Policy'),
  ('terms-and-conditions', 'Terms and Conditions'),
  ('accessibility-policy', 'Accessibility Statement'),
  ('refund-returns', 'Refund and Returns')
ON CONFLICT (slug) DO NOTHING;
