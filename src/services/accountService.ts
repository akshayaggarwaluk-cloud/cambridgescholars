/**
 * CSP Account Service
 *
 * Wraps the account-proxy edge function which bridges to the upstream
 * /api/website/account endpoints (profile, password, orders, wishlist, ebooks).
 * The upstream JWT (in-memory access token) is forwarded as the Authorization header.
 */

import { supabase } from "@/integrations/supabase/client";
import { getAccessToken, type AuthUserData } from "@/services/authService";

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

async function extractErrorMessage(error: unknown, fallbackData: unknown): Promise<string> {
  const ctx = (error as { context?: Response })?.context;
  if (ctx && typeof ctx.text === "function") {
    try {
      const text = await ctx.text();
      if (text) {
        try {
          const parsed = JSON.parse(text) as ErrorPayload;
          return parsed.error || parsed.detail || parsed.message || text;
        } catch {
          return text;
        }
      }
    } catch {
      // ignore
    }
  }
  const payload = fallbackData as ErrorPayload | null;
  return (
    payload?.error ||
    payload?.detail ||
    payload?.message ||
    (error as { message?: string })?.message ||
    "Request failed"
  );
}

async function callAccount<T>(
  body: Record<string, unknown>
): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("You are not signed in. Please log in again.");
  }

  const { data, error } = await supabase.functions.invoke("account-proxy", {
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (error) {
    const msg = await extractErrorMessage(error, data);
    throw new Error(msg);
  }
  const payload = data as (T & ErrorPayload) | ErrorPayload | null;
  if (payload && typeof payload === "object" && "error" in payload && payload.error) {
    throw new Error(payload.error || "Request failed");
  }
  return data as T;
}

// ── Public API ──────────────────────────────────────────────────

export async function getProfile(): Promise<AccountProfile> {
  return callAccount<AccountProfile>({ action: "get_profile" });
}

export async function updateProfile(
  payload: ProfileUpdatePayload
): Promise<AccountProfile> {
  return callAccount<AccountProfile>({ action: "update_profile", payload });
}

export async function changePassword(params: {
  current_password: string;
  new_password: string;
}): Promise<{ message: string }> {
  return callAccount<{ message: string }>({
    action: "change_password",
    current_password: params.current_password,
    new_password: params.new_password,
  });
}

export async function listOrders(
  page = 1,
  perPage = 10
): Promise<OrderListResponse> {
  return callAccount<OrderListResponse>({
    action: "list_orders",
    page,
    per_page: perPage,
  });
}

export async function getOrder(orderId: number | string): Promise<OrderDetail> {
  return callAccount<OrderDetail>({
    action: "get_order",
    order_id: orderId,
  });
}

export async function getWishlist(): Promise<WishlistResponse> {
  return callAccount<WishlistResponse>({ action: "get_wishlist" });
}

export async function addToWishlistApi(
  isbn: string
): Promise<{ message: string; item_id?: number }> {
  return callAccount<{ message: string; item_id?: number }>({
    action: "add_wishlist",
    isbn,
  });
}

export async function removeFromWishlistApi(
  isbn: string
): Promise<{ message: string }> {
  return callAccount<{ message: string }>({
    action: "remove_wishlist",
    isbn,
  });
}

export async function listEbooks(): Promise<EbooksResponse> {
  return callAccount<EbooksResponse>({ action: "list_ebooks" });
}
