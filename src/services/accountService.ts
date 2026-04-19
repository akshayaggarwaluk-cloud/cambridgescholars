/**
 * CSP Account Service
 *
 * Wraps the account-proxy edge function which bridges to the upstream
 * /api/website/account endpoints (profile + password). The upstream JWT
 * (in-memory access token) is forwarded as the Authorization header.
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
