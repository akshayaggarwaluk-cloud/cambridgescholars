/**
 * CSP Auth Service
 *
 * Calls the Cambridge Scholars website auth API via the auth-proxy edge function.
 * - Access token: held in memory (set by ExternalAuthContext)
 * - Refresh token: persisted in localStorage for cross-reload sessions
 */

import { supabase } from "@/integrations/supabase/client";

// ── Types ────────────────────────────────────────────────────────

export interface AuthAddress {
  first_name?: string;
  last_name?: string;
  company?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  email?: string;
  phone?: string;
}

export interface AuthUserData {
  id: number | string;
  email: string;
  username?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  registered_at?: string;
  billing?: AuthAddress;
  shipping?: AuthAddress;
}

export interface AuthSuccessResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUserData;
}

export interface RefreshResponse {
  access_token: string;
}

interface ErrorPayload {
  error?: string;
  code?: string;
  detail?: string;
  message?: string;
}

// ── Internal helpers ────────────────────────────────────────────

async function callAuthEndpoint<T>(
  endpoint: "register" | "login" | "refresh" | "logout",
  body: Record<string, unknown> = {}
): Promise<T> {
  const { data, error } = await supabase.functions.invoke("auth-proxy", {
    body: { endpoint, ...body },
  });

  if (error) {
    // Edge function returned non-2xx; data may still contain an error message
    const payload = data as ErrorPayload | null;
    const msg =
      payload?.error || payload?.detail || payload?.message || error.message || "Request failed";
    throw new Error(msg);
  }

  const payload = data as (T & ErrorPayload) | ErrorPayload | null;
  if (payload && typeof payload === "object" && "error" in payload && payload.error) {
    throw new Error(payload.error || "Request failed");
  }

  return data as T;
}

// ── Refresh token storage (localStorage only) ───────────────────

const REFRESH_TOKEN_KEY = "cspRefreshToken";

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ── Public API ──────────────────────────────────────────────────

export async function register(params: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<AuthSuccessResponse> {
  return callAuthEndpoint<AuthSuccessResponse>("register", params);
}

export async function login(
  email: string,
  password: string
): Promise<AuthSuccessResponse> {
  return callAuthEndpoint<AuthSuccessResponse>("login", { email, password });
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return null;
  try {
    const res = await callAuthEndpoint<RefreshResponse>("refresh", { refresh_token });
    return res?.access_token ?? null;
  } catch (e) {
    console.warn("[auth] refresh failed:", e);
    clearRefreshToken();
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await callAuthEndpoint("logout", {});
  } catch (e) {
    // Logout is best-effort on the server side
    console.warn("[auth] logout call failed:", e);
  } finally {
    clearRefreshToken();
  }
}

// ── In-memory access token (set/read by AuthContext) ────────────

let _accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export function isAuthenticated(): boolean {
  return !!_accessToken;
}
