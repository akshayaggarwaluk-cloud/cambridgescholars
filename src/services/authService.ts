/**
 * CSP Auth Service — direct browser → API (no Supabase, no edge proxy)
 *
 * - Access token: held in memory
 * - Refresh token: persisted in localStorage (survives reloads and browser restarts)
 *
 * ⚠️ This service makes raw cross-origin requests to api.cambridgescholars.com.
 * It will only work if CORS is configured upstream for the current origin.
 */

const API_BASE =
  (import.meta.env.VITE_CSP_API_BASE as string | undefined) ||
  "https://api.cambridgescholars.com/api/website";

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

// ── Internal fetch helpers ──────────────────────────────────────

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

type AuthEndpoint =
  | "register/send-otp"
  | "register/verify-otp"
  | "login"
  | "refresh"
  | "logout"
  | "forgot-password"
  | "reset-password";

async function postAuth<T>(
  endpoint: AuthEndpoint,
  body: Record<string, unknown> = {},
  bearer?: string,
): Promise<T> {
  const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  // Some endpoints (e.g. logout) may return empty bodies
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

// ── Refresh token storage (localStorage) ────────────────────────

const REFRESH_TOKEN_KEY = "cspRefreshToken";

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY) ??
      sessionStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string): void {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
    // Clean up any legacy sessionStorage value from older sessions.
    try { sessionStorage.removeItem(REFRESH_TOKEN_KEY); } catch { /* ignore */ }
  } catch {
    // ignore (e.g. private mode)
  }
}

export function clearRefreshToken(): void {
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    try { sessionStorage.removeItem(REFRESH_TOKEN_KEY); } catch { /* ignore */ }
  } catch {
    // ignore
  }
}

// ── Public API ──────────────────────────────────────────────────

/**
 * Step 1 of registration: validates input and sends a 6-digit OTP to the email.
 * Returns `{ message }` on success. The OTP expires after 15 minutes.
 */
export async function sendRegisterOtp(params: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<{ message: string }> {
  return postAuth<{ message: string }>("register/send-otp", params);
}

/**
 * Step 2 of registration: verifies the OTP and creates the account.
 * The same email/password/name from step 1 must be supplied again.
 */
export async function verifyRegisterOtp(params: {
  email: string;
  password: string;
  otp: string;
  first_name: string;
  last_name: string;
}): Promise<AuthSuccessResponse> {
  return postAuth<AuthSuccessResponse>("register/verify-otp", params);
}

/**
 * Sends a password-reset OTP to the email. Always resolves (200) regardless of
 * whether the email is registered, to prevent account enumeration.
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  return postAuth<{ message: string }>("forgot-password", { email });
}

/**
 * Verifies a reset OTP and sets a new password.
 */
export async function resetPassword(params: {
  email: string;
  otp: string;
  new_password: string;
}): Promise<{ message: string }> {
  return postAuth<{ message: string }>("reset-password", params);
}

export async function login(
  email: string,
  password: string,
): Promise<AuthSuccessResponse> {
  return postAuth<AuthSuccessResponse>("login", { email, password });
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return null;
  try {
    const res = await postAuth<RefreshResponse>("refresh", { refresh_token });
    return res?.access_token ?? null;
  } catch (e) {
    console.warn("[auth] refresh failed:", e);
    clearRefreshToken();
    return null;
  }
}

export async function logout(): Promise<void> {
  const token = getAccessToken();
  try {
    await postAuth("logout", {}, token || undefined);
  } catch (e) {
    console.warn("[auth] logout call failed:", e);
  } finally {
    clearRefreshToken();
  }
}

// ── In-memory access token ──────────────────────────────────────

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
