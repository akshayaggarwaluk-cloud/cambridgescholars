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

// Checkout calls go through a Supabase edge function proxy to bypass
// browser CORS restrictions on api.cambridgescholars.com. The proxy
// forwards Authorization + X-Cart-Token headers verbatim to the upstream
// /api/website/checkout/* endpoints.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const CHECKOUT_PROXY_BASE = `${SUPABASE_URL}/functions/v1/checkout-proxy`;

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
}

export interface MerchantSessionKeyResponse {
  merchant_session_key: string;
  expires_at?: string;
}

export interface CheckoutPayRequest {
  card_identifier: string;
  merchant_session_key: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  billing_address: Record<string, string | undefined>;
  shipping_address?: Record<string, string | undefined>;
  save_card?: boolean;
  browser?: Record<string, string | number | boolean | undefined>;
}

export interface CheckoutPayResponse {
  status: "ok" | "3ds_required" | "failed";
  order_id?: number | string;
  transaction_id?: string;
  redirect_url?: string;
  acs_url?: string;
  pareq?: string;
  cReq?: string;
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

// ─── Checkout API (Opayo Pi) ────────────────────────────────────

async function callCheckoutProxy<T>(
  action: "merchant-session-key" | "pay" | "3ds-complete",
  init: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const cartToken = getCartToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // Supabase edge functions still expect an apikey for the gateway,
    // even when verify_jwt is disabled.
    apikey: SUPABASE_ANON_KEY,
    ...((init.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  else headers["Authorization"] = `Bearer ${SUPABASE_ANON_KEY}`;
  if (cartToken) headers["X-Cart-Token"] = cartToken;

  let url = `${CHECKOUT_PROXY_BASE}/${action}`;
  if (cartToken && !token) {
    url += `?cart_token=${encodeURIComponent(cartToken)}`;
  }

  const res = await fetch(url, { ...init, headers });
  const text = await res.text();

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    if (text) {
      try {
        const p = JSON.parse(text) as ErrorPayload & { detail?: string };
        msg = p.error || p.detail || p.message || text;
      } catch {
        msg = text;
      }
    }
    throw new Error(msg);
  }

  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid response from payment gateway");
  }
}

export function getMerchantSessionKey(): Promise<MerchantSessionKeyResponse> {
  return callCheckoutProxy<MerchantSessionKeyResponse>("merchant-session-key");
}

export function checkoutPay(payload: CheckoutPayRequest): Promise<CheckoutPayResponse> {
  return callCheckoutProxy<CheckoutPayResponse>("pay", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function checkout3dsComplete(params: {
  transaction_id: string;
  pares?: string;
  cres?: string;
}): Promise<CheckoutPayResponse> {
  return callCheckoutProxy<CheckoutPayResponse>("3ds-complete", {
    method: "POST",
    body: JSON.stringify(params),
  });
}