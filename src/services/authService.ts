/**
 * CSP Auth Service
 * 
 * Authentication API endpoints proxied through edge function to avoid CORS
 */

import { supabase } from "@/integrations/supabase/client";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
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
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add endpoint as query param workaround - invoke doesn't support query params directly
  // So we'll pass it in the body instead
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-proxy?endpoint=${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify(body),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || responseData.error || "Request failed");
  }

  return responseData;
}

// =============================================================================
// AUTH API FUNCTIONS
// =============================================================================

/**
 * POST /api/auth/register
 * Register a new user with email
 */
export async function register(email: string): Promise<AuthResponse> {
  return callAuthEndpoint("register", { email });
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
 */
export async function checkUserExists(email: string): Promise<UserExistsResponse> {
  return callAuthEndpoint("user-exist", { email });
}

/**
 * POST /api/auth/send-otp
 * Send OTP to email for verification
 */
export async function sendOtp(email: string): Promise<OtpResponse> {
  return callAuthEndpoint("send-otp", { email });
}

/**
 * POST /api/auth/validate-otp
 * Validate the OTP entered by user
 */
export async function validateOtp(email: string, otp: string): Promise<OtpResponse> {
  return callAuthEndpoint("validate-otp", { email, otp });
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
