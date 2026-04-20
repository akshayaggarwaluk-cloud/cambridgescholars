-- Drop the old email-allowlist table since we're replacing it with full admin accounts
DROP TABLE IF EXISTS public.cms_admins;

-- New table: admin accounts with their own credentials
CREATE TABLE public.cms_admin_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Normalize emails to lowercase for case-insensitive lookup
CREATE UNIQUE INDEX cms_admin_accounts_email_lower_idx
  ON public.cms_admin_accounts (LOWER(email));

ALTER TABLE public.cms_admin_accounts ENABLE ROW LEVEL SECURITY;

-- Deny ALL public access. Only the edge function (service role) may read/write.
CREATE POLICY "No public access to admin accounts"
  ON public.cms_admin_accounts
  FOR SELECT
  USING (false);

-- Reuse existing updated_at trigger function
CREATE TRIGGER set_cms_admin_accounts_updated_at
  BEFORE UPDATE ON public.cms_admin_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();