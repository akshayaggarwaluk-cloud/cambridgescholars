/**
 * CSP Account Service — direct browser → API (no Supabase, no edge proxy)
 *
 * Wraps the upstream /api/website/account/* endpoints. The in-memory
 * access token is sent as Authorization: Bearer <token>.
 */

import { getAccessToken } from "@/services/authService";
import type { AuthUserData } from "@/services/authService";

const API_BASE =
  (import.meta.env.VITE_CSP_API_BASE as string | undefined) ||
  "https://api.cambridgescholars.com/api/website";

export type AccountProfile = AuthUserData;

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  display_name?: string;
  // Billing (flat, snake_case + prefix per upstream spec)
  billing_first_name?: string;
  billing_last_name?: string;
  billing_company?: string;
  billing_address_1?: string;
  billing_address_2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postcode?: string;
  billing_country?: string;
  billing_email?: string;
  billing_phone?: string;
  // Shipping
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_company?: string;
  shipping_address_1?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postcode?: string;
  shipping_country?: string;
  shipping_phone?: string;
}

// ── Orders ──────────────────────────────────────────────────────

export interface OrderSummary {
  id: number;
  status: string;
  currency: string;
  total_amount: number;
  billing_email?: string | null;
  payment_method_title?: string | null;
  created_at: string;
}

export interface OrderListResponse {
  orders: OrderSummary[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
}

export interface OrderItemDetail {
  name: string;
  isbn?: string | null;
  quantity: number;
  unit_price?: number | null;
  subtotal?: number | null;
  total?: number | null;
  tax?: number | null;
}

export interface OrderAddressBlock {
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

export interface OrderCoupon {
  code?: string | null;
  discount?: number | null;
}

export interface OrderDetail {
  id: number;
  status: string;
  currency: string;
  tax_amount?: number | null;
  total_amount: number;
  billing_email?: string | null;
  payment_method?: string | null;
  payment_method_title?: string | null;
  transaction_id?: string | null;
  customer_note?: string | null;
  created_at?: string | null;
  date_paid_gmt?: string | null;
  date_completed_gmt?: string | null;
  shipping_total_amount?: number | null;
  discount_total_amount?: number | null;
  billing?: OrderAddressBlock;
  shipping?: OrderAddressBlock;
  items: OrderItemDetail[];
  coupons?: OrderCoupon[];
}

// ── Wishlist ────────────────────────────────────────────────────

export interface WishlistItem {
  id: number;
  isbn?: string | null;
  quantity: number;
  original_price?: number | null;
  original_currency?: string | null;
  added_at?: string | null;
}

export interface WishlistResponse {
  wishlist_id: number;
  items: WishlistItem[];
}

// ── Ebooks ──────────────────────────────────────────────────────

export interface EbookActivation {
  isbn13?: string | null;
  isbn10?: string | null;
  isbn?: string | null;
  vitalsource_book_id?: string | null;
  activated_at?: string | null;
}

export interface EbooksResponse {
  ebooks: EbookActivation[];
}

// ── Internal ────────────────────────────────────────────────────

interface ErrorPayload {
  error?: string;
  detail?: string;
  message?: string;
}

async function parseError(res: Response): Promise<string> {
  try {
    const text = await res.text();
    if (!text) return `Request failed (${res.status})`;
    try {
      const parsed = JSON.parse(text) as ErrorPayload;
      return (
        parsed.error ||
        parsed.detail ||
        parsed.message ||
        text ||
        `Request failed (${res.status})`
      );
    } catch {
      return text;
    }
  } catch {
    return `Request failed (${res.status})`;
  }
}

async function callAccount<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("You are not signed in. Please log in again.");
  }

  const res = await fetch(`${API_BASE}/account${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid response from server");
  }
}

// ── Public API ──────────────────────────────────────────────────

export async function getProfile(): Promise<AccountProfile> {
  return callAccount<AccountProfile>("/profile");
}

export async function updateProfile(
  payload: ProfileUpdatePayload,
): Promise<AccountProfile> {
  return callAccount<AccountProfile>("/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function changePassword(params: {
  current_password: string;
  new_password: string;
}): Promise<{ message: string }> {
  return callAccount<{ message: string }>("/password", {
    method: "PUT",
    body: JSON.stringify(params),
  });
}

export async function listOrders(
  page = 1,
  perPage = 10,
): Promise<OrderListResponse> {
  const qs = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  return callAccount<OrderListResponse>(`/orders?${qs.toString()}`);
}

export async function getOrder(orderId: number | string): Promise<OrderDetail> {
  return callAccount<OrderDetail>(`/orders/${encodeURIComponent(String(orderId))}`);
}

export async function getWishlist(): Promise<WishlistResponse> {
  return callAccount<WishlistResponse>("/wishlist");
}

export async function addToWishlistApi(
  isbn: string,
): Promise<{ message: string; item_id?: number }> {
  return callAccount<{ message: string; item_id?: number }>("/wishlist", {
    method: "POST",
    body: JSON.stringify({ isbn }),
  });
}

export async function removeFromWishlistApi(
  isbn: string,
): Promise<{ message: string }> {
  return callAccount<{ message: string }>(
    `/wishlist/${encodeURIComponent(isbn)}`,
    { method: "DELETE" },
  );
}

export async function listEbooks(): Promise<EbooksResponse> {
  return callAccount<EbooksResponse>("/ebooks");
}
