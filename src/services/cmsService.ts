/**
 * CMS service — wraps the cms-admin edge function.
 *
 * Admin auth is fully self-contained: admins log in with email + password
 * via `login`, receive a signed JWT, and send it on every subsequent call
 * via the `X-Admin-Token` header.
 */
import { supabase } from "@/integrations/supabase/client";

// ── CMS Orders (admin) ───────────────────────────────────────────
// These types match the external CMS API at /api/website/cms/orders.
// They are separate from the customer-facing types in accountService
// because the admin endpoints expose more fields and a different
// pagination envelope.
export interface CmsOrderSummary {
  id: number;
  status: string;
  currency: string;
  total_amount: number;
  billing_email?: string | null;
  billing_name?: string | null;
  billing_country?: string | null;
  payment_method?: string | null;
  payment_method_title?: string | null;
  failure_reason?: string | null;
  item_count?: number | null;
  created_at: string;
  updated_at?: string | null;
}

export interface CmsOrderListResponse {
  data: CmsOrderSummary[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface CmsOrderItem {
  name: string;
  isbn?: string | null;
  format?: string | null;
  quantity: number;
  unit_price?: number | null;
  subtotal?: number | null;
  total?: number | null;
}

export interface CmsOrderAddress {
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface CmsOrderCoupon {
  code?: string | null;
  discount?: number | null;
  applied_at?: string | null;
}

export interface CmsOrderTotals {
  items_subtotal?: number | null;
  discount?: number | null;
  shipping?: number | null;
  tax?: number | null;
  total?: number | null;
}

export interface CmsOrderDetail {
  id: number;
  status: string;
  currency: string;
  billing_email?: string | null;
  customer_id?: number | null;
  payment_method?: string | null;
  payment_method_title?: string | null;
  transaction_id?: string | null;
  vendor_tx_code?: string | null;
  opayo_status?: string | null;
  failure_reason?: string | null;
  ip_address?: string | null;
  customer_note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  items: CmsOrderItem[];
  billing?: CmsOrderAddress;
  shipping?: CmsOrderAddress;
  coupons?: CmsOrderCoupon[];
  totals?: CmsOrderTotals;
}

// ── CMS Proposals (admin, external CMS API) ─────────────────────
export interface CmsProposalSummaryExt {
  id: number;
  reference_number: string;
  status: string;
  book_title?: string | null;
  book_subject?: string | null;
  book_type?: string | null;
  lead_author_name?: string | null;
  lead_author_email?: string | null;
  author_count?: number | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
}

export interface CmsProposalListResponse {
  data: CmsProposalSummaryExt[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface CmsProposalFile {
  id: number;
  file_name: string;
  file_type?: string | null;
  file_size_bytes?: number | null;
  virus_scanned?: boolean | null;
  virus_scan_result?: string | null;
  uploaded_at?: string | null;
  download_url?: string | null;
}

export interface CmsProposalDetailExt {
  id: number;
  reference_number: string;
  status: string;
  submission?: Record<string, unknown> | null;
  authors?: Array<Record<string, unknown>> | null;
  mailing?: Record<string, unknown> | null;
  book?: Record<string, unknown> | null;
  description?: Record<string, unknown> | null;
  marketing?: Record<string, unknown> | null;
  manuscript?: Record<string, unknown> | null;
  agreement?: Record<string, unknown> | null;
  s3_folder?: string | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  review_notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  files?: CmsProposalFile[];
}

// ── CMS Contact Messages (admin) ─────────────────────────────────
export interface CmsContactMessageSummary {
  id: number;
  ticket_id?: string | null;
  name: string;
  email: string;
  subject?: string | null;
  subject_id?: number | null;
  subject_name?: string | null;
  message_preview?: string | null;
  recaptcha_verified?: boolean | null;
  created_at: string;
}

export interface CmsContactMessageListResponse {
  data: CmsContactMessageSummary[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface CmsContactMessageDetail {
  id: number;
  ticket_id?: string | null;
  name: string;
  email: string;
  subject?: string | null;
  subject_id?: number | null;
  subject_name?: string | null;
  message: string;
  ip_address?: string | null;
  user_agent?: string | null;
  recaptcha_verified?: boolean | null;
  created_at: string;
}

export interface CmsCustomerUserSummary {
  id: number;
  email: string;
  name?: string | null;
  is_active?: boolean | null;
  billing_country?: string | null;
  registered_at?: string | null;
  created_at?: string | null;
  order_count?: number | null;
  lifetime_spend?: number | null;
  last_order_at?: string | null;
}

export interface CmsCustomerUserListResponse {
  data: CmsCustomerUserSummary[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface CmsCustomerAddress {
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface CmsCustomerRecentOrder {
  id: number;
  status: string;
  currency?: string | null;
  total_amount?: number | null;
  payment_method_title?: string | null;
  failure_reason?: string | null;
  created_at: string;
}

export interface CmsCustomerUserDetail {
  id: number;
  wp_user_id?: number | null;
  email: string;
  username?: string | null;
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  is_active?: boolean | null;
  registered_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  billing?: CmsCustomerAddress | null;
  shipping?: CmsCustomerAddress | null;
  stats?: {
    successful_orders?: number | null;
    total_orders?: number | null;
    lifetime_spend?: number | null;
    last_order_at?: string | null;
    wishlist_count?: number | null;
    ebook_count?: number | null;
  } | null;
  recent_orders?: CmsCustomerRecentOrder[] | null;
}

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
  role?: string | null;
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
  id: number;
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
  id: number;
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
  id: number;
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsResource {
  id: number;
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

export interface CmsPolicyPage {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  is_builtin?: boolean;
  updated_at: string;
  created_at: string;
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

export interface CmsCoupon {
  id: number;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_gbp: number | null;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
  /**
   * Restrict the coupon to a specific book binding. `null` means the
   * coupon applies to every binding in the cart.
   * Allowed values: "hardback", "paperback", "ebook".
   * (The upstream CSP CMS API uses a singular `binding` field.)
   */
  binding?: string | null;
}

export interface CmsPagination {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

// ─── Public reads (no auth) ─────────────────────────────────────
//
// Hero slides, news, FAQs, resources and policy pages are served by the
// external CSP CMS REST API (https://api.cambridgescholars.com/api/website/cms/*),
// added 2026-09-01. These are plain unauthenticated GETs — the API returns
// only published rows by default; `include_unpublished=true` (admin-only,
// see adminApi below) is what surfaces drafts.

class CmsHttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function callPublicCms<T = unknown>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${CMS_API_BASE}${path}`, { headers: { Accept: "application/json" } });
  } catch {
    throw new Error("Unable to reach the CMS server. Please try again.");
  }
  let parsed: unknown = null;
  try { parsed = await res.json(); } catch { /* ignore */ }
  if (!res.ok) {
    const err = (parsed as { error?: string } | null)?.error;
    throw new CmsHttpError(err || `Request failed (${res.status})`, res.status);
  }
  return parsed as T;
}

export async function fetchPublishedHeroSlides(): Promise<CmsHeroSlide[]> {
  const res = await callPublicCms<{ data: CmsHeroSlide[] }>("/hero-slides");
  return res.data || [];
}

export async function fetchPublishedNews(): Promise<CmsNewsArticle[]> {
  const res = await callPublicCms<{ data: CmsNewsArticle[] }>("/news");
  return res.data || [];
}

export async function fetchHomepageNews(): Promise<CmsNewsArticle[]> {
  const res = await callPublicCms<{ data: CmsNewsArticle[] }>("/news?homepage=true&limit=20");
  return res.data || [];
}

export async function fetchPublishedNewsBySlug(slug: string): Promise<CmsNewsArticle | null> {
  try {
    const res = await callPublicCms<{ data: CmsNewsArticle }>(`/news/slug/${encodeURIComponent(slug)}`);
    return res.data;
  } catch (e) {
    if (e instanceof CmsHttpError && e.status === 404) return null;
    throw e;
  }
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
  const res = await callPublicCms<{ data: CmsFaq[] }>("/faqs");
  return res.data || [];
}

export async function fetchPublishedResources(): Promise<CmsResource[]> {
  const res = await callPublicCms<{ data: CmsResource[] }>("/resources");
  return res.data || [];
}

export async function fetchPublishedResourceBySlug(slug: string): Promise<CmsResource | null> {
  try {
    const res = await callPublicCms<{ data: CmsResource }>(`/resources/slug/${encodeURIComponent(slug)}`);
    return res.data;
  } catch (e) {
    if (e instanceof CmsHttpError && e.status === 404) return null;
    throw e;
  }
}

export async function fetchPublishedFooterDocuments(): Promise<CmsFooterDocument[]> {
  const { data, error } = await supabase
    .from("cms_footer_documents").select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data || []) as CmsFooterDocument[];
}

export async function fetchPolicyPages(): Promise<CmsPolicyPage[]> {
  const res = await callPublicCms<{ data: CmsPolicyPage[] }>("/policy-pages");
  return res.data || [];
}

export async function fetchPolicyPageBySlug(slug: string): Promise<CmsPolicyPage | null> {
  try {
    const res = await callPublicCms<{ data: CmsPolicyPage }>(`/policy-pages/slug/${encodeURIComponent(slug)}`);
    return res.data;
  } catch (e) {
    if (e instanceof CmsHttpError && e.status === 404) return null;
    throw e;
  }
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
    admin?: { id: string | number; email: string; name?: string | null; is_active?: boolean; role?: string | null };
  };
  if (!data?.access_token || !data.admin?.email) {
    throw new Error("Unexpected login response from CMS");
  }

  const user: CmsAdminUser = {
    id: data.admin.id,
    email: data.admin.email,
    name: data.admin.name ?? null,
    role: data.admin.role ?? null,
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

function decodeJwtExp(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (padded.length % 4)) % 4);
    const payload = JSON.parse(atob(padded + padding)) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/**
 * Verifies the admin session locally — no network round-trip. The login
 * response already authenticated this session and cached the admin user;
 * this just checks the stored JWT hasn't expired since.
 */
export function adminWhoAmI(): Promise<CmsAdminUser | null> {
  const token = adminSession.getToken();
  const user = adminSession.getUser();
  if (!token || !user) return Promise.resolve(null);

  const exp = decodeJwtExp(token);
  if (exp !== null && exp * 1000 < Date.now()) {
    adminSession.clear();
    return Promise.resolve(null);
  }

  return Promise.resolve(user);
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
    callExternalCms<{ data: CmsHeroSlide[] }>("/hero-slides?include_unpublished=true").then((r) => r.data),
  createHero: (payload: Partial<CmsHeroSlide>) =>
    callExternalCms<{ data: CmsHeroSlide }>("/hero-slides", { method: "POST", body: payload }).then((r) => r.data),
  updateHero: (payload: Partial<CmsHeroSlide> & { id: number | string }) => {
    const { id, ...rest } = payload;
    return callExternalCms<{ data: CmsHeroSlide }>(`/hero-slides/${encodeURIComponent(String(id))}`, {
      method: "PUT", body: rest,
    }).then((r) => r.data);
  },
  deleteHero: (id: number | string) =>
    callExternalCms<{ ok?: true }>(`/hero-slides/${encodeURIComponent(String(id))}`, { method: "DELETE" }),

  listNews: () =>
    callExternalCms<{ data: CmsNewsArticle[] }>("/news?include_unpublished=true").then((r) => r.data),
  createNews: (payload: Partial<CmsNewsArticle>) =>
    callExternalCms<{ data: CmsNewsArticle }>("/news", { method: "POST", body: payload }).then((r) => r.data),
  updateNews: (payload: Partial<CmsNewsArticle> & { id: number | string }) => {
    const { id, ...rest } = payload;
    return callExternalCms<{ data: CmsNewsArticle }>(`/news/${encodeURIComponent(String(id))}`, {
      method: "PUT", body: rest,
    }).then((r) => r.data);
  },
  deleteNews: (id: number | string) =>
    callExternalCms<{ ok?: true }>(`/news/${encodeURIComponent(String(id))}`, { method: "DELETE" }),

  // NOTE: /cms/uploads response shape ("returns S3 URL") wasn't fully
  // specified — this defensively reads either { url } or { data: { url } }.
  // Verify against a real admin session and simplify once confirmed.
  uploadImage: async (file: File): Promise<string> => {
    const buf = await file.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    const base64 = btoa(binary);
    const res = await callExternalCms<{ url?: string; data?: { url?: string } }>("/uploads", {
      method: "POST",
      body: { filename: file.name, content_type: file.type || "application/octet-stream", base64 },
    });
    const url = res.url ?? res.data?.url;
    if (!url) throw new Error("Unexpected response from upload");
    return url;
  },

  uploadFile: async (file: File): Promise<string> => {
    return adminApi.uploadImage(file);
  },

  // ─── Admin accounts ──────────────────────────────────────────
  listAdmins: async (): Promise<CmsAdminAccount[]> => {
    // The upstream CMS exposes /admins only as POST (create). Until a
    // list endpoint is implemented we silently return an empty array so
    // the dashboard / Admins page renders without an error toast.
    try {
      const res = await callExternalCms<{ data: CmsAdminAccount[] }>("/admins");
      return res.data || [];
    } catch (err) {
      console.warn("[cms] listAdmins not available on backend:", err);
      return [];
    }
  },
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
    callExternalCms<{ data: CmsFaq[] }>("/faqs?include_unpublished=true").then((r) => r.data),
  createFaq: (payload: Partial<CmsFaq>) =>
    callExternalCms<{ data: CmsFaq }>("/faqs", { method: "POST", body: payload }).then((r) => r.data),
  updateFaq: (payload: Partial<CmsFaq> & { id: number | string }) => {
    const { id, ...rest } = payload;
    return callExternalCms<{ data: CmsFaq }>(`/faqs/${encodeURIComponent(String(id))}`, {
      method: "PUT", body: rest,
    }).then((r) => r.data);
  },
  deleteFaq: (id: number | string) =>
    callExternalCms<{ ok?: true }>(`/faqs/${encodeURIComponent(String(id))}`, { method: "DELETE" }),

  // ─── Resources ───────────────────────────────────────────────
  listResources: () =>
    callExternalCms<{ data: CmsResource[] }>("/resources?include_unpublished=true").then((r) => r.data),
  createResource: (payload: Partial<CmsResource>) =>
    callExternalCms<{ data: CmsResource }>("/resources", { method: "POST", body: payload }).then((r) => r.data),
  updateResource: (payload: Partial<CmsResource> & { id: number | string }) => {
    const { id, ...rest } = payload;
    return callExternalCms<{ data: CmsResource }>(`/resources/${encodeURIComponent(String(id))}`, {
      method: "PUT", body: rest,
    }).then((r) => r.data);
  },
  deleteResource: (id: number | string) =>
    callExternalCms<{ ok?: true }>(`/resources/${encodeURIComponent(String(id))}`, { method: "DELETE" }),

  // ─── Footer Documents ────────────────────────────────────────
  listFooterDocuments: () =>
    callAdmin<{ data: CmsFooterDocument[] }>({ action: "list_footer_documents" }).then((r) => r.data),
  createFooterDocument: (payload: Partial<CmsFooterDocument>) =>
    callAdmin<{ data: CmsFooterDocument }>({ action: "create_footer_document", ...payload }).then((r) => r.data),
  updateFooterDocument: (payload: Partial<CmsFooterDocument> & { id: string }) =>
    callAdmin<{ data: CmsFooterDocument }>({ action: "update_footer_document", ...payload }).then((r) => r.data),
  deleteFooterDocument: (id: string) => callAdmin({ action: "delete_footer_document", id }),

  // ─── Policy Pages (footer "Other links") ─────────────────────
  listPolicyPages: () =>
    callExternalCms<{ data: CmsPolicyPage[] }>("/policy-pages").then((r) => r.data),
  updatePolicyPage: (payload: { id: number | string; title?: string; content?: string | null }) => {
    const { id, ...rest } = payload;
    return callExternalCms<{ data: CmsPolicyPage }>(`/policy-pages/${encodeURIComponent(String(id))}`, {
      method: "PUT", body: rest,
    }).then((r) => r.data);
  },
  createPolicyPage: (payload: { slug: string; title: string; content?: string | null }) =>
    callExternalCms<{ data: CmsPolicyPage }>("/policy-pages", { method: "POST", body: payload }).then((r) => r.data),
  deletePolicyPage: (id: number | string) =>
    callExternalCms<{ ok?: true }>(`/policy-pages/${encodeURIComponent(String(id))}`, { method: "DELETE" }),

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

  // ─── Coupons (external CMS API) ──────────────────────────────
  listCoupons: (opts: { active?: boolean; page?: number; per_page?: number } = {}) => {
    const qs = new URLSearchParams();
    if (opts.active !== undefined) qs.set("active", String(opts.active));
    if (opts.page) qs.set("page", String(opts.page));
    if (opts.per_page) qs.set("per_page", String(opts.per_page));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return callExternalCms<{ data: CmsCoupon[]; pagination?: CmsPagination }>(`/coupons${suffix}`);
  },
  getCoupon: (id: number) =>
    callExternalCms<{ data: CmsCoupon }>(`/coupons/${id}`).then((r) => r.data),
  createCoupon: (payload: {
    code: string;
    discount_type: "percent" | "fixed";
    discount_value: number;
    min_order_gbp?: number | null;
    max_uses?: number | null;
    expires_at?: string | null;
    active?: boolean;
    binding?: string | null;
  }) =>
    callExternalCms<{ data: CmsCoupon }>("/coupons", {
      method: "POST",
      body: payload,
    }).then((r) => r.data),
  updateCoupon: (id: number, payload: Partial<{
    code: string;
    discount_type: "percent" | "fixed";
    discount_value: number;
    min_order_gbp: number | null;
    max_uses: number | null;
    expires_at: string | null;
    active: boolean;
    binding: string | null;
  }>) =>
    callExternalCms<{ data: CmsCoupon }>(`/coupons/${id}`, {
      method: "PUT",
      body: payload,
    }).then((r) => r.data),
  deleteCoupon: (id: number) =>
    callExternalCms<{ message?: string }>(`/coupons/${id}`, { method: "DELETE" }),

  // ─── Orders (external CMS API — ALL customers) ───────────────
  // Requires admin Bearer JWT. Returns every order in the store,
  // with rich filtering / sorting.
  listAllOrders: (opts: {
    page?: number;
    per_page?: number;
    status?: string;
    payment_method?: string;
    q?: string;
    date_from?: string;
    date_to?: string;
    sort?: string;
    order?: "asc" | "desc";
  } = {}) => {
    const qs = new URLSearchParams();
    if (opts.page) qs.set("page", String(opts.page));
    if (opts.per_page) qs.set("per_page", String(opts.per_page));
    if (opts.status) qs.set("status", opts.status);
    if (opts.payment_method) qs.set("payment_method", opts.payment_method);
    if (opts.q) qs.set("q", opts.q);
    if (opts.date_from) qs.set("date_from", opts.date_from);
    if (opts.date_to) qs.set("date_to", opts.date_to);
    if (opts.sort) qs.set("sort", opts.sort);
    if (opts.order) qs.set("order", opts.order);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return callExternalCms<CmsOrderListResponse>(`/orders${suffix}`);
  },
  getOrderById: (id: number | string) =>
    callExternalCms<CmsOrderDetail>(`/orders/${encodeURIComponent(String(id))}`),
  updateOrderStatus: (id: number | string, status: string) =>
    callExternalCms<{ id: number; status: string; updated_at: string }>(
      `/orders/${encodeURIComponent(String(id))}/status`,
      { method: "PATCH", body: { status } },
    ),

  // ─── Proposals (external CMS API) ────────────────────────────
  listAllProposals: (opts: {
    page?: number;
    per_page?: number;
    status?: string;
    q?: string;
    date_from?: string;
    date_to?: string;
    sort?: string;
    order?: "asc" | "desc";
  } = {}) => {
    const qs = new URLSearchParams();
    if (opts.page) qs.set("page", String(opts.page));
    if (opts.per_page) qs.set("per_page", String(opts.per_page));
    if (opts.status) qs.set("status", opts.status);
    if (opts.q) qs.set("q", opts.q);
    if (opts.date_from) qs.set("date_from", opts.date_from);
    if (opts.date_to) qs.set("date_to", opts.date_to);
    if (opts.sort) qs.set("sort", opts.sort);
    if (opts.order) qs.set("order", opts.order);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return callExternalCms<CmsProposalListResponse>(`/proposals${suffix}`);
  },
  getProposalById: (id: number | string) =>
    callExternalCms<CmsProposalDetailExt>(`/proposals/${encodeURIComponent(String(id))}`),
  updateProposal: (
    id: number | string,
    payload: { status?: string; review_notes?: string },
  ) =>
    callExternalCms<{
      id: number; status: string; reviewed_at: string; reviewed_by: string;
      review_notes: string; updated_at: string;
    }>(`/proposals/${encodeURIComponent(String(id))}`, { method: "PATCH", body: payload }),

  // ─── Contact messages (external CMS API) ─────────────────────
  listContactMessages: (opts: {
    page?: number;
    per_page?: number;
    q?: string;
    subject_id?: number;
    date_from?: string;
    date_to?: string;
    sort?: string;
    order?: "asc" | "desc";
  } = {}) => {
    const qs = new URLSearchParams();
    if (opts.page) qs.set("page", String(opts.page));
    if (opts.per_page) qs.set("per_page", String(opts.per_page));
    if (opts.q) qs.set("q", opts.q);
    if (opts.subject_id !== undefined) qs.set("subject_id", String(opts.subject_id));
    if (opts.date_from) qs.set("date_from", opts.date_from);
    if (opts.date_to) qs.set("date_to", opts.date_to);
    if (opts.sort) qs.set("sort", opts.sort);
    if (opts.order) qs.set("order", opts.order);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return callExternalCms<CmsContactMessageListResponse>(`/contact-messages${suffix}`);
  },
  getContactMessage: (id: number | string) =>
    callExternalCms<CmsContactMessageDetail>(`/contact-messages/${encodeURIComponent(String(id))}`),

  // ─── Customer users (external CMS API) ───────────────────────
  listCustomerUsers: (opts: {
    page?: number;
    per_page?: number;
    q?: string;
    is_active?: "true" | "false" | "";
    has_orders?: "true" | "false" | "";
    date_from?: string;
    date_to?: string;
    sort?: string;
    order?: "asc" | "desc";
  } = {}) => {
    const qs = new URLSearchParams();
    if (opts.page) qs.set("page", String(opts.page));
    if (opts.per_page) qs.set("per_page", String(opts.per_page));
    if (opts.q) qs.set("q", opts.q);
    if (opts.is_active) qs.set("is_active", opts.is_active);
    if (opts.has_orders) qs.set("has_orders", opts.has_orders);
    if (opts.date_from) qs.set("date_from", opts.date_from);
    if (opts.date_to) qs.set("date_to", opts.date_to);
    if (opts.sort) qs.set("sort", opts.sort);
    if (opts.order) qs.set("order", opts.order);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return callExternalCms<CmsCustomerUserListResponse>(`/users${suffix}`);
  },
  getCustomerUser: (id: number | string) =>
    callExternalCms<CmsCustomerUserDetail>(`/users/${encodeURIComponent(String(id))}`),
};
