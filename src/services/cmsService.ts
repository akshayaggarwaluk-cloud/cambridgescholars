/**
 * CMS service — wraps the cms-admin edge function.
 *
 * Admin auth is fully self-contained: admins log in with email + password
 * via `login`, receive a signed JWT, and send it on every subsequent call
 * via the `X-Admin-Token` header.
 */
import { supabase } from "@/integrations/supabase/client";

const ADMIN_TOKEN_KEY = "cms_admin_token";
const ADMIN_USER_KEY = "cms_admin_user";

export interface CmsAdminUser {
  id: string;
  email: string;
  name?: string | null;
}

export const adminSession = {
  getToken(): string | null {
    try { return localStorage.getItem(ADMIN_TOKEN_KEY); } catch { return null; }
  },
  getUser(): CmsAdminUser | null {
    try {
      const raw = localStorage.getItem(ADMIN_USER_KEY);
      return raw ? (JSON.parse(raw) as CmsAdminUser) : null;
    } catch { return null; }
  },
  set(token: string, user: CmsAdminUser) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  },
};

export interface CmsHeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  author: string | null;
  quote: string | null;
  reviewer_name: string | null;
  reviewer_position: string | null;
  cover_image: string | null;
  link_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsNewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  author: string | null;
  published_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsAdminAccount {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

// ─── New CMS entity types ────────────────────────────────────

export interface CmsFeaturedBook {
  id: string;
  book_id: string | null;
  title: string;
  subtitle: string | null;
  author: string | null;
  cover_image: string | null;
  link_url: string | null;
  description: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsAuthorReview {
  id: string;
  author_name: string;
  position: string | null;
  quote: string;
  photo_url: string | null;
  book_title: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsFaq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsResource {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsFooterDocument {
  id: string;
  label: string;
  file_url: string;
  description: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  phone: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CmsProposalSubmission {
  id: string;
  author_name: string;
  author_email: string;
  book_title: string | null;
  book_subject: string | null;
  data: Record<string, unknown>;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CmsOrderRow {
  id: string;
  user_id: string;
  status: string;
  total: number;
  shipping_address: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  items: Array<{
    id: string; book_id: string; book_title: string; book_author: string;
    book_image: string | null; price: number; quantity: number;
  }>;
  notes: {
    payment_status: string | null;
    fulfillment_status: string | null;
    admin_notes: string | null;
  } | null;
}

export interface CmsAuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  banned_until: string | null;
  user_metadata: Record<string, unknown>;
}

// ─── Public reads (no auth) ─────────────────────────────────────

export async function fetchPublishedHeroSlides(): Promise<CmsHeroSlide[]> {
  const { data, error } = await supabase
    .from("cms_hero_slides")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as CmsHeroSlide[];
}

export async function fetchPublishedNews(): Promise<CmsNewsArticle[]> {
  const { data, error } = await supabase
    .from("cms_news_articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data || []) as CmsNewsArticle[];
}

export async function fetchPublishedNewsBySlug(slug: string): Promise<CmsNewsArticle | null> {
  const { data, error } = await supabase
    .from("cms_news_articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return (data || null) as CmsNewsArticle | null;
}

export async function fetchPublishedFeaturedBooks(): Promise<CmsFeaturedBook[]> {
  const { data, error } = await supabase
    .from("cms_featured_books").select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as CmsFeaturedBook[];
}

export async function fetchPublishedAuthorReviews(): Promise<CmsAuthorReview[]> {
  const { data, error } = await supabase
    .from("cms_author_reviews").select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as CmsAuthorReview[];
}

export async function fetchPublishedFaqs(): Promise<CmsFaq[]> {
  const { data, error } = await supabase
    .from("cms_faqs").select("*")
    .eq("is_published", true)
    .order("category", { ascending: true })
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data || []) as CmsFaq[];
}

export async function fetchPublishedResources(): Promise<CmsResource[]> {
  const { data, error } = await supabase
    .from("cms_resources").select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data || []) as CmsResource[];
}

export async function fetchPublishedResourceBySlug(slug: string): Promise<CmsResource | null> {
  const { data, error } = await supabase
    .from("cms_resources").select("*")
    .eq("slug", slug).eq("is_published", true).maybeSingle();
  if (error) throw error;
  return (data || null) as CmsResource | null;
}

export async function fetchPublishedFooterDocuments(): Promise<CmsFooterDocument[]> {
  const { data, error } = await supabase
    .from("cms_footer_documents").select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data || []) as CmsFooterDocument[];
}

// ─── Public writes — submissions ────────────────────────────────

export async function submitContactForm(input: {
  name: string; email: string; message: string; subject?: string; phone?: string;
}): Promise<void> {
  const { error } = await supabase.from("cms_contact_submissions").insert([{
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    subject: input.subject?.trim() || null,
    phone: input.phone?.trim() || null,
  }]);
  if (error) throw error;
}

export async function submitProposalForm(input: {
  author_name: string;
  author_email: string;
  book_title?: string;
  book_subject?: string;
  data: Record<string, unknown>;
}): Promise<void> {
  const { error } = await supabase.from("cms_proposal_submissions").insert([{
    author_name: input.author_name.trim(),
    author_email: input.author_email.trim(),
    book_title: input.book_title?.trim() || null,
    book_subject: input.book_subject?.trim() || null,
    data: input.data as never,
  }]);
  if (error) throw error;
}

// ─── Admin calls (via edge function) ────────────────────────────

async function callAdmin<T = unknown>(
  body: Record<string, unknown>,
  opts: { token?: string | null; requireAuth?: boolean } = {},
): Promise<T> {
  const token = opts.token ?? adminSession.getToken();
  if (opts.requireAuth !== false && !token) throw new Error("Not signed in");

  const headers: Record<string, string> = {};
  if (token) headers["X-Admin-Token"] = token;

  const { data, error } = await supabase.functions.invoke("cms-admin", { body, headers });
  if (error) {
    type ErrCtx = { context?: { body?: string } };
    const ctxBody = (error as ErrCtx).context?.body;
    if (ctxBody) {
      try {
        const parsed = JSON.parse(ctxBody);
        if (parsed?.error) throw new Error(parsed.error);
      } catch {
        /* fall through */
      }
    }
    throw new Error(error.message || "Admin request failed");
  }
  if ((data as { error?: string })?.error) {
    throw new Error((data as { error: string }).error);
  }
  return data as T;
}

// ─── Auth ───────────────────────────────────────────────────────

export async function adminLogin(email: string, password: string): Promise<CmsAdminUser> {
  const res = await callAdmin<{ token: string; admin: CmsAdminUser }>(
    { action: "login", email, password },
    { requireAuth: false },
  );
  adminSession.set(res.token, res.admin);
  return res.admin;
}

export function adminLogout() {
  adminSession.clear();
}

export async function adminWhoAmI(): Promise<CmsAdminUser | null> {
  const token = adminSession.getToken();
  if (!token) return null;
  try {
    const res = await callAdmin<{ admin: CmsAdminUser }>({ action: "whoami" });
    return res.admin;
  } catch {
    adminSession.clear();
    return null;
  }
}

// ─── CRUD ──────────────────────────────────────────────────────

export const adminApi = {
  listHero: () =>
    callAdmin<{ data: CmsHeroSlide[] }>({ action: "list_hero" }).then((r) => r.data),
  createHero: (payload: Partial<CmsHeroSlide>) =>
    callAdmin<{ data: CmsHeroSlide }>({ action: "create_hero", ...payload }).then((r) => r.data),
  updateHero: (payload: Partial<CmsHeroSlide> & { id: string }) =>
    callAdmin<{ data: CmsHeroSlide }>({ action: "update_hero", ...payload }).then((r) => r.data),
  deleteHero: (id: string) => callAdmin({ action: "delete_hero", id }),

  listNews: () =>
    callAdmin<{ data: CmsNewsArticle[] }>({ action: "list_news" }).then((r) => r.data),
  createNews: (payload: Partial<CmsNewsArticle>) =>
    callAdmin<{ data: CmsNewsArticle }>({ action: "create_news", ...payload }).then((r) => r.data),
  updateNews: (payload: Partial<CmsNewsArticle> & { id: string }) =>
    callAdmin<{ data: CmsNewsArticle }>({ action: "update_news", ...payload }).then((r) => r.data),
  deleteNews: (id: string) => callAdmin({ action: "delete_news", id }),

  uploadImage: async (file: File): Promise<string> => {
    const buf = await file.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    const base64 = btoa(binary);
    const res = await callAdmin<{ url: string }>({
      action: "upload_image",
      filename: file.name,
      content_type: file.type,
      base64,
    });
    return res.url;
  },

  // ─── Admin accounts ──────────────────────────────────────────
  listAdmins: () =>
    callAdmin<{ data: CmsAdminAccount[] }>({ action: "list_admins" }).then((r) => r.data),
  createAdmin: (payload: { email: string; password: string; name?: string; is_active?: boolean }) =>
    callAdmin<{ data: CmsAdminAccount }>({ action: "create_admin", ...payload }).then((r) => r.data),
  updateAdmin: (payload: { id: string; email?: string; name?: string; password?: string; is_active?: boolean }) =>
    callAdmin<{ data: CmsAdminAccount }>({ action: "update_admin", ...payload }).then((r) => r.data),
  deleteAdmin: (id: string) => callAdmin({ action: "delete_admin", id }),
};
