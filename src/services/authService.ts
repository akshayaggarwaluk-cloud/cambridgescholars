/**
 * CSP Auth Service
 * 
 * Authentication API endpoints proxied through edge function to avoid CORS
 */

import { supabase } from "@/integrations/supabase/client";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface AuthUserData {
  id: number | string;
  email: string;
  username?: string;
  full_name?: string | null;
  name?: string;
  phone?: string | null;
  is_active?: boolean;
  is_verified?: boolean;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string | null;
  // Direct token (legacy format)
  token?: string;
  user?: AuthUserData;
  // Nested data format (current API)
  data?: {
    access_token?: string;
    token_type?: string;
    user?: AuthUserData;
  };
}

export interface OtpResponse {
  success: boolean;
  message?: string;
}

export interface UserExistsResponse {
  exists: boolean;
  message?: string;
}

// =============================================================================
// HELPER FUNCTION
// =============================================================================

async function callAuthEndpoint(endpoint: string, body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("auth-proxy", {
    body: {
      endpoint,
      ...body,
    },
  });

  if (error) {
    throw new Error(error.message || "Request failed");
  }

  // Check if the API returned an error in the data
  if (data?.error) {
    throw new Error(data.error);
  }
  
  if (data?.detail && !data?.success) {
    // Some endpoints return { detail: "error message" } for errors
    throw new Error(data.detail);
  }

  return data;
}

// =============================================================================
// AUTH API FUNCTIONS
// =============================================================================

/**
 * POST /api/auth/register
 * Register a new user (OTP must already be validated if required)
 */
export async function register(
  email: string,
  password: string,
  username?: string
): Promise<AuthResponse> {
  return callAuthEndpoint("register", {
    email,
    password,
    username: username ?? email,
  });
}

/**
 * POST /api/auth/login
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  return callAuthEndpoint("login", { email, password });
}

/**
 * POST /api/auth/user-exist
 * Check if a user exists by email
 * Returns { exists: boolean } - handles various API response formats
 */
export async function checkUserExists(email: string): Promise<UserExistsResponse> {
  try {
    const data = await callAuthEndpoint("user-exist", { email });
    
    // Handle different response formats from the API
    // The API might return: { exists: true/false } or { detail: "..." } or other formats
    if (data?.exists !== undefined) {
      return { exists: Boolean(data.exists), message: data.message };
    }
    
    // If the API returns a detail field indicating user exists
    if (data?.detail?.toLowerCase().includes("exist") || 
        data?.detail?.toLowerCase().includes("registered") ||
        data?.detail?.toLowerCase().includes("found")) {
      return { exists: true, message: data.detail };
    }
    
    // If we got a response without exists field, assume user doesn't exist
    return { exists: false, message: data?.message };
  } catch (error) {
    // If the API throws an error indicating user exists
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("exist") || 
        message.toLowerCase().includes("registered") ||
        message.toLowerCase().includes("found")) {
      return { exists: true, message };
    }
    // For other errors, re-throw
    throw error;
  }
}

/**
 * POST /api/auth/send-otp
 * Send OTP to email for verification
 * @param purpose - "registration" or "password_reset"
 */
export async function sendOtp(
  email: string,
  purpose: "registration" | "password_reset" = "registration"
): Promise<OtpResponse> {
  return callAuthEndpoint("send-otp", { email, purpose });
}

/**
 * POST /api/auth/validate-otp
 * Validate the OTP entered by user
 * API expects: otp_code + purpose
 */
export async function validateOtp(
  email: string,
  otp: string,
  purpose: "registration" | "password_reset" = "registration"
): Promise<OtpResponse> {
  return callAuthEndpoint("validate-otp", { email, otp_code: otp, purpose });
}

/**
 * POST /api/auth/forgot-password
 * Request password reset link/OTP
 */
export async function forgotPassword(email: string): Promise<OtpResponse> {
  return callAuthEndpoint("forgot-password", { email });
}

/**
 * POST /api/auth/reset-password
 * Reset password with token/OTP
 */
export async function resetPassword(
  email: string, 
  otp: string, 
  newPassword: string
): Promise<AuthResponse> {
  return callAuthEndpoint("reset-password", { email, otp, password: newPassword });
}

// =============================================================================
// AUTH TOKEN MANAGEMENT
// =============================================================================

export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("authToken", token);
}

export function removeAuthToken(): void {
  localStorage.removeItem("authToken");
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
