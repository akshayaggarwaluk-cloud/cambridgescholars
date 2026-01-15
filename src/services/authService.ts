/**
 * CSP Auth Service
 * 
 * Authentication API endpoints for the CSP Auth Service
 * Base URL: http://54.253.4.186:8001
 */

const AUTH_API_BASE = "http://54.253.4.186:8001/api/auth";

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
// AUTH API FUNCTIONS
// =============================================================================

/**
 * POST /api/auth/register
 * Register a new user with email
 */
export async function register(email: string): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

/**
 * POST /api/auth/login
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

/**
 * POST /api/auth/user-exist
 * Check if a user exists by email
 */
export async function checkUserExists(email: string): Promise<UserExistsResponse> {
  const response = await fetch(`${AUTH_API_BASE}/user-exist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to check user");
  }

  return data;
}

/**
 * POST /api/auth/send-otp
 * Send OTP to email for verification
 */
export async function sendOtp(email: string): Promise<OtpResponse> {
  const response = await fetch(`${AUTH_API_BASE}/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send OTP");
  }

  return data;
}

/**
 * POST /api/auth/validate-otp
 * Validate the OTP entered by user
 */
export async function validateOtp(email: string, otp: string): Promise<OtpResponse> {
  const response = await fetch(`${AUTH_API_BASE}/validate-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Invalid OTP");
  }

  return data;
}

/**
 * POST /api/auth/forgot-password
 * Request password reset link/OTP
 */
export async function forgotPassword(email: string): Promise<OtpResponse> {
  const response = await fetch(`${AUTH_API_BASE}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send reset link");
  }

  return data;
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
  const response = await fetch(`${AUTH_API_BASE}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp, password: newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password");
  }

  return data;
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
