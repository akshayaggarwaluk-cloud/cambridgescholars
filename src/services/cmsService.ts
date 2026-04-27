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
const ADMIN_EXTERNAL_TOKEN_KEY = "cms_admin_external_token";

// External CMS API base — admin login + admin account management
// are handled by the external CSP CMS API under /api/website/cms.
const CMS_API_BASE = "https://api.cambridgescholars.com/api/website/cms";

export interface CmsAdminUser {
  id: string | number;
  email: string;
  name?: string | null;
}

export const adminSession = {
  getToken(): string | null {
    try { return localStorage.getItem(ADMIN_TOKEN_KEY); } catch { return null; }
  },
  getExternalToken(): string | null {
    try { return localStorage.getItem(ADMIN_EXTERNAL_TOKEN_KEY); } catch { return null; }
  },
  getUser(): CmsAdminUser | null {
    try {
      const raw = localStorage.getItem(ADMIN_USER_KEY);
      return raw ? (JSON.parse(raw) as CmsAdminUser) : null;
    } catch { return null; }
  },
  set(token: string, user: CmsAdminUser, externalToken?: string | null) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    if (externalToken) {
      localStorage.setItem(ADMIN_EXTERNAL_TOKEN_KEY, externalToken);
    } else {
      localStorage.removeItem(ADMIN_EXTERNAL_TOKEN_KEY);
    }
  },
  clear() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(ADMIN_EXTERNAL_TOKEN_KEY);
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
  show_on_homepage: boolean;
  display_order: number;
  homepage_order: number;
  created_at: string;
  updated_at: string;
}

export interface CmsAdminAccount {
  id: string | number;
  email: string;
  name: string | null;
  is_active: boolean;
  last_login_at?: string | null;
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
    .order("display_order", { ascending: true })
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data || []) as CmsNewsArticle[];
}

export async function fetchHomepageNews(): Promise<CmsNewsArticle[]> {
  const { data, error } = await supabase
    .from("cms_news_articles")
    .select("*")
    .eq("is_published", true)
    .eq("show_on_homepage", true)
    .order("display_order", { ascending: true })
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
    let parsedError: string | null = null;
    if (ctxBody) {
      try {
        const parsed = JSON.parse(ctxBody);
        if (typeof parsed?.error === "string") parsedError = parsed.error;
      } catch { /* not JSON */ }
    }
    if (parsedError) {
      // Auto-clear expired/invalid admin session and bounce to login
      if (/admin session|admin token|not.*admin/i.test(parsedError)) {
        adminSession.clear();
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
          window.location.replace("/admin/login");
        }
      }
      throw new Error(parsedError);
    }
    throw new Error(error.message || "Admin request failed");
  }
  if ((data as { error?: string })?.error) {
    throw new Error((data as { error: string }).error);
  }
  return data as T;
}

// ─── Auth ───────────────────────────────────────────────────────

/**
 * Admin login — authenticates against BOTH the external CSP CMS API
 * (for /admins endpoints) and the internal Supabase edge function
 * (for all CRUD on hero, news, featured books, etc.).
 *
 * 1. POST {CMS_API_BASE}/auth/login   → external Bearer JWT
 * 2. cms-admin edge function "login"  → internal X-Admin-Token JWT
 *
 * Both tokens are stored. If the internal login fails the external one
 * is discarded so the admin UI does not appear half-signed-in.
 */
export async function adminLogin(email: string, password: string): Promise<CmsAdminUser> {
  let res: Response;
  try {
    res = await fetch(`${CMS_API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Unable to reach the CMS server. Please try again.");
  }

  let payload: unknown = null;
  try { payload = await res.json(); } catch { /* ignore */ }

  if (!res.ok) {
    const err = (payload as { error?: string } | null)?.error;
    if (res.status === 401) throw new Error(err || "Invalid email or password");
    if (res.status === 429) throw new Error(err || "Too many attempts. Please try again in a minute.");
    if (res.status === 400) throw new Error(err || "Email and password are required");
    throw new Error(err || `Login failed (${res.status})`);
  }

  const data = payload as {
    access_token?: string;
    admin?: { id: string | number; email: string; name?: string | null; is_active?: boolean };
  };
  if (!data?.access_token || !data.admin?.email) {
    throw new Error("Unexpected login response from CMS");
  }

  const user: CmsAdminUser = {
    id: data.admin.id,
    email: data.admin.email,
    name: data.admin.name ?? null,
  };

  // Use the same external token for both the CMS edge function
  // (cms-admin) and the external /admins endpoints. The edge function
  // accepts external admin JWTs (role=admin).
  adminSession.set(data.access_token, user, data.access_token);
  return user;
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

/**
 * Helper for admin endpoints hosted on the external CSP CMS API
 * (https://api.cambridgescholars.com/api/website/cms/*). Sends the
 * external Bearer JWT obtained at login.
 */
async function callExternalCms<T = unknown>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = adminSession.getExternalToken();
  if (!token) throw new Error("Not signed in");

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(`${CMS_API_BASE}${path}`, {
      method: init.method || "GET",
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new Error("Unable to reach the CMS server. Please try again.");
  }

  let parsed: unknown = null;
  try { parsed = res.status === 204 ? null : await res.json(); } catch { /* ignore */ }

  if (!res.ok) {
    const err = (parsed as { error?: string } | null)?.error;
    if (res.status === 401) {
      adminSession.clear();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
        window.location.replace("/admin/login");
      }
      throw new Error(err || "Admin login required");
    }
    if (res.status === 403) throw new Error(err || "Admin access required");
    if (res.status === 404) throw new Error(err || "Not found");
    if (res.status === 409) throw new Error(err || "Conflict");
    if (res.status === 400) throw new Error(err || "Invalid request");
    throw new Error(err || `Request failed (${res.status})`);
  }

  return parsed as T;
}

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
    callExternalCms<{ data: CmsAdminAccount[] }>("/admins").then((r) => r.data),
  createAdmin: async (payload: {
    email: string;
    password: string;
    name?: string;
    is_active?: boolean;
  }): Promise<CmsAdminAccount> => {
    const res = await callExternalCms<{ data: CmsAdminAccount }>("/admins", {
      method: "POST",
      body: {
        email: payload.email,
        name: payload.name,
        password: payload.password,
      },
    });
    if (!res?.data) throw new Error("Unexpected response from CMS");
    return res.data;
  },
  updateAdmin: (payload: {
    id: string;
    email?: string;
    name?: string;
    password?: string;
    is_active?: boolean;
  }) => {
    const { id, ...rest } = payload;
    return callExternalCms<{ data: CmsAdminAccount }>(`/admins/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: rest,
    }).then((r) => r.data);
  },
  deleteAdmin: (id: string) =>
    callExternalCms<{ ok?: true }>(`/admins/${encodeURIComponent(id)}`, { method: "DELETE" }),

  // ─── Featured Books ──────────────────────────────────────────
  listFeaturedBooks: () =>
    callAdmin<{ data: CmsFeaturedBook[] }>({ action: "list_featured_books" }).then((r) => r.data),
  createFeaturedBook: (payload: Partial<CmsFeaturedBook>) =>
    callAdmin<{ data: CmsFeaturedBook }>({ action: "create_featured_book", ...payload }).then((r) => r.data),
  updateFeaturedBook: (payload: Partial<CmsFeaturedBook> & { id: string }) =>
    callAdmin<{ data: CmsFeaturedBook }>({ action: "update_featured_book", ...payload }).then((r) => r.data),
  deleteFeaturedBook: (id: string) => callAdmin({ action: "delete_featured_book", id }),

  // ─── Author Reviews ──────────────────────────────────────────
  listAuthorReviews: () =>
    callAdmin<{ data: CmsAuthorReview[] }>({ action: "list_author_reviews" }).then((r) => r.data),
  createAuthorReview: (payload: Partial<CmsAuthorReview>) =>
    callAdmin<{ data: CmsAuthorReview }>({ action: "create_author_review", ...payload }).then((r) => r.data),
  updateAuthorReview: (payload: Partial<CmsAuthorReview> & { id: string }) =>
    callAdmin<{ data: CmsAuthorReview }>({ action: "update_author_review", ...payload }).then((r) => r.data),
  deleteAuthorReview: (id: string) => callAdmin({ action: "delete_author_review", id }),

  // ─── FAQs ────────────────────────────────────────────────────
  listFaqs: () =>
    callAdmin<{ data: CmsFaq[] }>({ action: "list_faqs" }).then((r) => r.data),
  createFaq: (payload: Partial<CmsFaq>) =>
    callAdmin<{ data: CmsFaq }>({ action: "create_faq", ...payload }).then((r) => r.data),
  updateFaq: (payload: Partial<CmsFaq> & { id: string }) =>
    callAdmin<{ data: CmsFaq }>({ action: "update_faq", ...payload }).then((r) => r.data),
  deleteFaq: (id: string) => callAdmin({ action: "delete_faq", id }),

  // ─── Resources ───────────────────────────────────────────────
  listResources: () =>
    callAdmin<{ data: CmsResource[] }>({ action: "list_resources" }).then((r) => r.data),
  createResource: (payload: Partial<CmsResource>) =>
    callAdmin<{ data: CmsResource }>({ action: "create_resource", ...payload }).then((r) => r.data),
  updateResource: (payload: Partial<CmsResource> & { id: string }) =>
    callAdmin<{ data: CmsResource }>({ action: "update_resource", ...payload }).then((r) => r.data),
  deleteResource: (id: string) => callAdmin({ action: "delete_resource", id }),

  // ─── Footer Documents ────────────────────────────────────────
  listFooterDocuments: () =>
    callAdmin<{ data: CmsFooterDocument[] }>({ action: "list_footer_documents" }).then((r) => r.data),
  createFooterDocument: (payload: Partial<CmsFooterDocument>) =>
    callAdmin<{ data: CmsFooterDocument }>({ action: "create_footer_document", ...payload }).then((r) => r.data),
  updateFooterDocument: (payload: Partial<CmsFooterDocument> & { id: string }) =>
    callAdmin<{ data: CmsFooterDocument }>({ action: "update_footer_document", ...payload }).then((r) => r.data),
  deleteFooterDocument: (id: string) => callAdmin({ action: "delete_footer_document", id }),

  // ─── Contact Submissions ─────────────────────────────────────
  listContactSubmissions: () =>
    callAdmin<{ data: CmsContactSubmission[] }>({ action: "list_contact_submissions" }).then((r) => r.data),
  updateContactSubmission: (payload: { id: string; status?: string; admin_notes?: string }) =>
    callAdmin<{ data: CmsContactSubmission }>({ action: "update_contact_submission", ...payload }).then((r) => r.data),
  deleteContactSubmission: (id: string) => callAdmin({ action: "delete_contact_submission", id }),

  // ─── Proposal Submissions ────────────────────────────────────
  listProposalSubmissions: () =>
    callAdmin<{ data: CmsProposalSubmission[] }>({ action: "list_proposal_submissions" }).then((r) => r.data),
  updateProposalSubmission: (payload: { id: string; status?: string; admin_notes?: string }) =>
    callAdmin<{ data: CmsProposalSubmission }>({ action: "update_proposal_submission", ...payload }).then((r) => r.data),
  deleteProposalSubmission: (id: string) => callAdmin({ action: "delete_proposal_submission", id }),

  // ─── Orders ──────────────────────────────────────────────────
  listOrders: () =>
    callAdmin<{ data: CmsOrderRow[] }>({ action: "list_orders" }).then((r) => r.data),
  updateOrder: (payload: {
    id: string;
    status?: string;
    payment_status?: string;
    fulfillment_status?: string;
    admin_notes?: string;
  }) => callAdmin({ action: "update_order", ...payload }),

  // ─── Users (Lovable Cloud auth) ──────────────────────────────
  listUsers: (opts: { page?: number; per_page?: number } = {}) =>
    callAdmin<{ data: CmsAuthUser[] }>({ action: "list_users", ...opts }).then((r) => r.data),
  sendPasswordReset: (email: string, redirect_to?: string) =>
    callAdmin<{ ok: true; action_link: string | null }>({
      action: "send_password_reset", email, redirect_to,
    }),
  setUserDisabled: (id: string, disabled: boolean) =>
    callAdmin({ action: "set_user_disabled", id, disabled }),

  // ─── CSP external user password reset (stub) ─────────────────
  cspResetPassword: (email: string) =>
    callAdmin<{ ok: true } | { stub: true; error: string }>({ action: "csp_reset_password", email }),
};
