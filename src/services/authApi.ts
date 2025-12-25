/**
 * AUTH API - Replace mock functions with your real API calls
 */

export interface User {
  id: string;
  email: string;
  fullName?: string;
}

// ============================================
// MOCK DATA - Remove when adding real API
// ============================================
let mockUser: User | null = null;

// ============================================
// API FUNCTIONS - Replace these with your API
// ============================================

export async function signIn(email: string, password: string) {
  // TODO: Replace with your API
  // const res = await fetch('YOUR_API/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  // return await res.json();
  
  mockUser = { id: "1", email, fullName: email.split("@")[0] };
  return { user: mockUser, error: null };
}

export async function signUp(email: string, password: string, fullName?: string) {
  // TODO: Replace with your API
  // const res = await fetch('YOUR_API/register', { method: 'POST', body: JSON.stringify({ email, password, fullName }) });
  // return await res.json();
  
  mockUser = { id: "1", email, fullName };
  return { user: mockUser, error: null };
}

export async function signInWithGoogle() {
  // TODO: Replace with your Google OAuth
  // window.location.href = 'YOUR_API/auth/google';
  
  mockUser = { id: "1", email: "demo@gmail.com", fullName: "Demo User" };
  return { user: mockUser, error: null };
}

export async function signOut() {
  // TODO: Replace with your API
  // await fetch('YOUR_API/logout', { method: 'POST' });
  
  mockUser = null;
}

export async function getCurrentUser() {
  // TODO: Replace with your API
  // const res = await fetch('YOUR_API/me');
  // return await res.json();
  
  return mockUser;
}
