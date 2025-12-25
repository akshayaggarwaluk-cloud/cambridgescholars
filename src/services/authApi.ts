// =============================================
// 👇 ADD YOUR API URL HERE 👇
// =============================================
const BASE_URL = "https://your-api.com/api";
// =============================================

export interface User {
  id: string;
  email: string;
  fullName?: string;
}

export async function signIn(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { user: null, error: new Error(data.message || "Login failed") };
  return { user: data.user as User, error: null };
}

export async function signUp(email: string, password: string, fullName?: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName }),
  });
  const data = await res.json();
  if (!res.ok) return { user: null, error: new Error(data.message || "Signup failed") };
  return { user: data.user as User, error: null };
}

export async function signInWithGoogle() {
  window.location.href = `${BASE_URL}/auth/google`;
  return { user: null, error: null };
}

export async function signOut() {
  await fetch(`${BASE_URL}/auth/logout`, { method: "POST" });
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}
