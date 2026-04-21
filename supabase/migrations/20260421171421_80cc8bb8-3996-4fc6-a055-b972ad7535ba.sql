
-- ─── CMS: Featured Books ──────────────────────────────────────
CREATE TABLE public.cms_featured_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT,
  cover_image TEXT,
  link_url TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_featured_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published featured books"
  ON public.cms_featured_books FOR SELECT USING (is_published = true);
CREATE TRIGGER trg_cms_featured_books_updated
  BEFORE UPDATE ON public.cms_featured_books
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── CMS: Author Reviews ──────────────────────────────────────
CREATE TABLE public.cms_author_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  position TEXT,
  quote TEXT NOT NULL,
  photo_url TEXT,
  book_title TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_author_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published author reviews"
  ON public.cms_author_reviews FOR SELECT USING (is_published = true);
CREATE TRIGGER trg_cms_author_reviews_updated
  BEFORE UPDATE ON public.cms_author_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── CMS: FAQs ────────────────────────────────────────────────
CREATE TABLE public.cms_faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published faqs"
  ON public.cms_faqs FOR SELECT USING (is_published = true);
CREATE TRIGGER trg_cms_faqs_updated
  BEFORE UPDATE ON public.cms_faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── CMS: Resources ───────────────────────────────────────────
CREATE TABLE public.cms_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published resources"
  ON public.cms_resources FOR SELECT USING (is_published = true);
CREATE TRIGGER trg_cms_resources_updated
  BEFORE UPDATE ON public.cms_resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── CMS: Footer Documents ────────────────────────────────────
CREATE TABLE public.cms_footer_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  file_url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_footer_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published footer documents"
  ON public.cms_footer_documents FOR SELECT USING (is_published = true);
CREATE TRIGGER trg_cms_footer_documents_updated
  BEFORE UPDATE ON public.cms_footer_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── CMS: Contact Submissions ─────────────────────────────────
CREATE TABLE public.cms_contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_contact_submissions ENABLE ROW LEVEL SECURITY;
-- Anyone (incl. anon) can submit a contact form
CREATE POLICY "Anyone can submit contact form"
  ON public.cms_contact_submissions FOR INSERT
  WITH CHECK (true);
-- No public reads / updates / deletes — admin-only via edge function
CREATE TRIGGER trg_cms_contact_submissions_updated
  BEFORE UPDATE ON public.cms_contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_cms_contact_submissions_created_at
  ON public.cms_contact_submissions (created_at DESC);

-- ─── CMS: Proposal Submissions ────────────────────────────────
CREATE TABLE public.cms_proposal_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  book_title TEXT,
  book_subject TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_proposal_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a proposal"
  ON public.cms_proposal_submissions FOR INSERT
  WITH CHECK (true);
CREATE TRIGGER trg_cms_proposal_submissions_updated
  BEFORE UPDATE ON public.cms_proposal_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_cms_proposal_submissions_created_at
  ON public.cms_proposal_submissions (created_at DESC);

-- ─── CMS: Order admin notes (optional metadata layer) ─────────
CREATE TABLE public.cms_order_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  payment_status TEXT,
  fulfillment_status TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (order_id)
);
ALTER TABLE public.cms_order_notes ENABLE ROW LEVEL SECURITY;
-- No public access — admin-only via edge function
CREATE TRIGGER trg_cms_order_notes_updated
  BEFORE UPDATE ON public.cms_order_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
