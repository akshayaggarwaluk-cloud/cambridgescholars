/**
 * CSP Cart & Checkout Service — direct browser → API
 *
 * Wraps /api/website/cart/* and /api/website/checkout/* endpoints.
 *
 * Cart endpoints work for both guest carts and authenticated carts:
 *  - When the user is signed in, the in-memory access token is sent as
 *    Authorization: Bearer <token>.
 *  - When the user is a guest, a `cart_token` is persisted in localStorage
 *    and forwarded back to the API on every request via the `X-Cart-Token`
 *    header (and as a query parameter as fallback).
 */

import { getAccessToken } from "@/services/authService";

const API_BASE =
  (import.meta.env.VITE_CSP_API_BASE as string | undefined) ||
  "https://api.cambridgescholars.com/api/website";

// ─── Types ──────────────────────────────────────────────────────

export interface CartItem {
  isbn: string;
  title?: string;
  author?: string;
  cover_image?: string | null;
  format?: string;
  quantity: number;
  unit_price_gbp?: number | null;
  subtotal_gbp?: number | null;
}

export interface CartResponse {
  cart_token?: string | null;
  item_count?: number;
  items: CartItem[];
  subtotal_gbp?: number | null;
  coupon_code?: string | null;
  discount_type?: "percent" | "fixed" | null;
  discount_value?: number | null;
  discount_gbp?: number | null;
  shipping_gbp?: number | null;
  shipping_requires_quote?: boolean | null;
  delivery_estimate?: string | null;
  total_gbp?: number | null;
  /**
   * ISBNs of cart items the currently-applied coupon discounts. When the
   * coupon is restricted by binding (e.g. paperback only) the backend
   * returns the matching items here so the UI can badge them.
   */
  coupon_eligible_isbns?: string[] | null;
  /** Optional list of binding types the coupon is restricted to. */
  coupon_eligible_bindings?: string[] | null;
}

/**
 * Request body for POST /api/website/checkout/pay — exact shape per the
 * CSP OpenAPI spec (CheckoutPayRequest schema). All fields are flat (no
 * nested `card` / `customer` / `billing_address` objects), and the country
 * is an ISO 3166-1 alpha-2 code (e.g. "GB", "IN").
 */
export type OpayoCardType = "VISA" | "MC" | "AMEX" | "MAESTRO" | "DISCOVER" | "DC";

export interface CheckoutPayRequest {
  card_holder: string;
  card_number: string;
  card_expiry: string; // MMYY
  card_cv2: string;
  card_type: OpayoCardType;
  billing_first_name: string;
  billing_last_name: string;
  billing_address_1: string;
  billing_city: string;
  billing_postcode: string;
  billing_country?: string; // ISO alpha-2, default "GB"
  customer_note?: string | null;
}

export interface CheckoutPayResponse {
  status: "success" | "3ds_required" | "failed";
  order_id?: number | string;
  transaction_id?: string;
  // 3DS v1 fields (Opayo Direct, legacy)
  acs_url?: string;
  pa_req?: string;
  md?: string;
  term_url?: string;
  // 3DS v2 fields (Opayo Direct)
  c_req?: string | null;
  three_ds_session_data?: string | null;
  // failure
  reason?: string;
  message?: string;
}

// ─── Guest cart token ───────────────────────────────────────────

const CART_TOKEN_KEY = "cspCartToken";

function normalizeIsbn(isbn: string): string {
  return isbn.replace(/[^0-9Xx]/g, "").toUpperCase();
}

function getCartToken(): string | null {
  try { return localStorage.getItem(CART_TOKEN_KEY); } catch { return null; }
}
function setCartToken(token: string | null) {
  try {
    if (token) localStorage.setItem(CART_TOKEN_KEY, token);
    else localStorage.removeItem(CART_TOKEN_KEY);
  } catch { /* ignore */ }
}
export function clearCartToken() { setCartToken(null); }

// ─── Internal ───────────────────────────────────────────────────

interface ErrorPayload { error?: string; detail?: string; message?: string }

async function parseError(res: Response): Promise<string> {
  try {
    const text = await res.text();
    if (!text) return `Request failed (${res.status})`;
    try {
      const p = JSON.parse(text) as ErrorPayload;
      return p.error || p.detail || p.message || text || `Request failed (${res.status})`;
    } catch { return text; }
  } catch { return `Request failed (${res.status})`; }
}

async function callCsp<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const cartToken = getCartToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (cartToken && !token) headers["X-Cart-Token"] = cartToken;

  // Also append cart_token as query param (some upstream variants expect it)
  let url = `${API_BASE}${path}`;
  if (cartToken && !token) {
    url += (url.includes("?") ? "&" : "?") + `cart_token=${encodeURIComponent(cartToken)}`;
  }

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) throw new Error(await parseError(res));

  const text = await res.text();
  if (!text) return {} as T;
  let json: unknown;
  try { json = JSON.parse(text); } catch { throw new Error("Invalid response from server"); }

  // Persist any returned cart_token so subsequent guest requests reuse it
  const maybe = json as { cart_token?: string | null };
  if (maybe && typeof maybe === "object" && typeof maybe.cart_token === "string") {
    setCartToken(maybe.cart_token);
  }
  return json as T;
}

// ─── Cart API ───────────────────────────────────────────────────

export function getCart(country?: string): Promise<CartResponse> {
  const qs = country ? `?country=${encodeURIComponent(country)}` : "";
  return callCsp<CartResponse>(`/cart${qs}`);
}

export function addCartItem(params: {
  isbn: string;
  quantity?: number;
  format?: string;
}): Promise<CartResponse> {
  return callCsp<CartResponse>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ quantity: 1, ...params, isbn: normalizeIsbn(params.isbn) }),
  });
}

export function updateCartItem(isbn: string, quantity: number): Promise<CartResponse> {
  return callCsp<CartResponse>(`/cart/items/${encodeURIComponent(normalizeIsbn(isbn))}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(isbn: string): Promise<CartResponse> {
  return callCsp<CartResponse>(`/cart/items/${encodeURIComponent(normalizeIsbn(isbn))}`, {
    method: "DELETE",
  });
}

export function applyCoupon(code: string): Promise<CartResponse> {
  return callCsp<CartResponse>("/cart/coupon", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export function removeCoupon(): Promise<CartResponse> {
  return callCsp<CartResponse>("/cart/coupon", { method: "DELETE" });
}

/** Merge the current guest cart into the authenticated user's cart. */
export async function mergeCart(): Promise<CartResponse> {
  const cartToken = getCartToken();
  const res = await callCsp<CartResponse>("/cart/merge", {
    method: "POST",
    body: JSON.stringify(cartToken ? { cart_token: cartToken } : {}),
  });
  // Once merged, the guest token is no longer needed
  clearCartToken();
  return res;
}

// ─── Checkout API (Opayo Direct) ────────────────────────────────
//
// Two-endpoint flow per the CSP API spec:
//   1. POST /checkout/pay        → JSON with card details
//   2. POST /checkout/3ds-callback/{order_id}  → called by the bank's ACS,
//      not by us. The backend then 302-redirects the browser to
//      /checkout/result?order_id=X&status=success|failed
//
// On `3ds_required` we build an HTML <form> targeting `acs_url` with the
// fields PaReq, MD, and TermUrl (using `term_url` from the response) and
// auto-submit it — that takes the customer to their bank's 3DS page.

export function checkoutPay(
  payload: CheckoutPayRequest,
): Promise<CheckoutPayResponse> {
  return callCsp<CheckoutPayResponse>("/checkout/pay", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}