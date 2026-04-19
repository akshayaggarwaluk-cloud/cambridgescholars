-- ============================================================
-- CMS schema: admins, hero slides, news articles
-- ============================================================

-- 1. Admin allowlist (keyed by CSP user email since auth lives upstream)
CREATE TABLE public.cms_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_admins ENABLE ROW LEVEL SECURITY;

-- Admin list is sensitive: no public read. Only edge functions (service role) read it.
CREATE POLICY "No public access to admin list"
  ON public.cms_admins FOR SELECT
  USING (false);

-- 2. Hero slides (Featured Reviews carousel replacement)
CREATE TABLE public.cms_hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  quote TEXT,
  reviewer_name TEXT,
  reviewer_position TEXT,
  cover_image TEXT,
  link_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_hero_slides ENABLE ROW LEVEL SECURITY;

-- Public can read published slides (homepage rendering)
CREATE POLICY "Anyone can view published hero slides"
  ON public.cms_hero_slides FOR SELECT
  USING (is_published = true);

-- No public writes — all writes go through cms-admin edge function (service role)

CREATE TRIGGER update_cms_hero_slides_updated_at
  BEFORE UPDATE ON public.cms_hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_cms_hero_slides_order
  ON public.cms_hero_slides (display_order, created_at DESC)
  WHERE is_published = true;

-- 3. News articles
CREATE TABLE public.cms_news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  author TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news"
  ON public.cms_news_articles FOR SELECT
  USING (is_published = true);

CREATE TRIGGER update_cms_news_articles_updated_at
  BEFORE UPDATE ON public.cms_news_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_cms_news_published_at
  ON public.cms_news_articles (published_at DESC)
  WHERE is_published = true;

-- 4. Storage bucket for CMS image uploads (hero covers, news covers)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-media', 'cms-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "CMS media is publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-media');

-- Writes to cms-media bucket are restricted: handled via service role in edge function
