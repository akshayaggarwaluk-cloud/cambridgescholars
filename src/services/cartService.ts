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
  unit_price?: number | null;
  subtotal?: number | null;
  currency?: string;
}

export interface CartCoupon {
  code: string;
  discount?: number | null;
  description?: string | null;
}

export interface CartResponse {
  cart_token?: string | null;
  items: CartItem[];
  subtotal?: number | null;
  shipping_total?: number | null;
  tax_total?: number | null;
  discount_total?: number | null;
  total?: number | null;
  currency?: string;
  coupon?: CartCoupon | null;
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

export function getCart(): Promise<CartResponse> {
  return callCsp<CartResponse>("/cart");
}

export function addCartItem(params: {
  isbn: string;
  quantity?: number;
  format?: string;
}): Promise<CartResponse> {
  return callCsp<CartResponse>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ quantity: 1, ...params }),
  });
}

export function updateCartItem(isbn: string, quantity: number): Promise<CartResponse> {
  return callCsp<CartResponse>(`/cart/items/${encodeURIComponent(isbn)}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(isbn: string): Promise<CartResponse> {
  return callCsp<CartResponse>(`/cart/items/${encodeURIComponent(isbn)}`, {
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

export function getMerchantSessionKey(): Promise<MerchantSessionKeyResponse> {
  return callCsp<MerchantSessionKeyResponse>("/checkout/merchant-session-key");
}

export function checkoutPay(payload: CheckoutPayRequest): Promise<CheckoutPayResponse> {
  return callCsp<CheckoutPayResponse>("/checkout/pay", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function checkout3dsComplete(params: {
  transaction_id: string;
  pares?: string;
  cres?: string;
}): Promise<CheckoutPayResponse> {
  return callCsp<CheckoutPayResponse>("/checkout/3ds-complete", {
    method: "POST",
    body: JSON.stringify(params),
  });
}