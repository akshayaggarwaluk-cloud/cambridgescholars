ALTER TABLE public.cms_news_articles
ADD COLUMN IF NOT EXISTS homepage_order integer NOT NULL DEFAULT 0;