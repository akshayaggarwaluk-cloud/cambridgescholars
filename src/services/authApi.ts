/**
 * Authentication API Service
 * 
 * This file contains all authentication API calls.
 * Currently using MOCK implementations for demo purposes.
 * 
 * TO ADD YOUR REAL API:
 * 1. Replace the mock implementations in each function below
 * 2. Update the User interface to match your API response
 * 3. Update error handling as needed for your API
 */

// User interface - update this to match your API response
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

// Simulated delay for mock API
const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user storage (simulates session)
let currentUser: User | null = null;

/**
 * Sign In with email and password
 * 
 * TODO: Replace with your real API call
 * Example:
 * const response = await fetch('YOUR_API_URL/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, password })
 * });
 * const data = await response.json();
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  await mockDelay();
  
  // MOCK IMPLEMENTATION - Replace with your API call
  // Demo: accept any email with password "password123"
  if (password === "password123" || password.length >= 6) {
    currentUser = {
      id: "mock-user-" + Date.now(),
      email,
      fullName: email.split("@")[0],
    };
    return { user: currentUser, error: null };
  }
  
  return { 
    user: null, 
    error: new Error("Invalid login credentials") 
  };
}

/**
 * Sign Up with email and password
 * 
 * TODO: Replace with your real API call
 * Example:
 * const response = await fetch('YOUR_API_URL/auth/register', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, password, fullName })
 * });
 * const data = await response.json();
 */
export async function signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
  await mockDelay();
  
  // MOCK IMPLEMENTATION - Replace with your API call
  currentUser = {
    id: "mock-user-" + Date.now(),
    email,
    fullName: fullName || email.split("@")[0],
  };
  
  return { user: currentUser, error: null };
}

/**
 * Sign In with Google
 * 
 * TODO: Replace with your real Google OAuth implementation
 * This typically involves redirecting to your OAuth endpoint
 * Example:
 * window.location.href = 'YOUR_API_URL/auth/google';
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  await mockDelay();
  
  // MOCK IMPLEMENTATION - Replace with your Google OAuth
  currentUser = {
    id: "google-user-" + Date.now(),
    email: "demo.user@gmail.com",
    fullName: "Demo Google User",
  };
  
  return { user: currentUser, error: null };
}

/**
 * Sign Out
 * 
 * TODO: Replace with your real API call
 * Example:
 * await fetch('YOUR_API_URL/auth/logout', {
 *   method: 'POST',
 *   headers: { 'Authorization': `Bearer ${token}` }
 * });
 */
export async function signOut(): Promise<void> {
  await mockDelay(500);
  
  // MOCK IMPLEMENTATION - Replace with your API call
  currentUser = null;
}

/**
 * Get current authenticated user
 * 
 * TODO: Replace with your real API call
 * Example:
 * const response = await fetch('YOUR_API_URL/auth/me', {
 *   headers: { 'Authorization': `Bearer ${token}` }
 * });
 * const data = await response.json();
 */
export async function getCurrentUser(): Promise<User | null> {
  await mockDelay(300);
  
  // MOCK IMPLEMENTATION - Replace with your API call
  // Check localStorage or cookie for persisted session
  return currentUser;
}

/**
 * Forgot Password / Reset Password Request
 * 
 * TODO: Replace with your real API call
 * Example:
 * const response = await fetch('YOUR_API_URL/auth/forgot-password', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email })
 * });
 */
export async function forgotPassword(email: string): Promise<{ error: Error | null }> {
  await mockDelay();
  
  // MOCK IMPLEMENTATION - Replace with your API call
  console.log("Password reset requested for:", email);
  return { error: null };
}
