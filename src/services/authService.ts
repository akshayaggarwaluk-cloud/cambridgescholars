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
    body: {
      endpoint,
      ...body,
    },
  });

  if (error) {
    throw new Error(error.message || "Request failed");
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
 */
export async function checkUserExists(email: string): Promise<UserExistsResponse> {
  return callAuthEndpoint("user-exist", { email });
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
