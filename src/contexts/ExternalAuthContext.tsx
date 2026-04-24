import { useContext, useEffect, useState, ReactNode, useCallback } from "react";
import {
  setAccessToken,
  refreshAccessToken,
  setRefreshToken,
  clearRefreshToken,
  logout as apiLogout,
  type AuthUserData,
} from "@/services/authService";
import {
  ExternalAuthContext,
  type ExternalUser,
  type LoginPayload,
} from "./external-auth-context-instance";

export type { ExternalUser } from "./external-auth-context-instance";

function normalizeUser(u: AuthUserData): ExternalUser {
  const fullName =
    u.display_name ||
    [u.first_name, u.last_name].filter(Boolean).join(" ").trim() ||
    undefined;
  return {
    id: String(u.id ?? ""),
    email: u.email,
    username: u.username || u.email,
    name: fullName,
    firstName: u.first_name,
    lastName: u.last_name,
  };
}

/**
 * Auth state lives entirely in memory + localStorage.
 * - Access token: in memory only (lost on reload — restored via refresh token).
 * - Refresh token: localStorage (persists across reloads and browser restarts).
 * - User profile: NOT persisted; restored from /account/profile after refresh.
 */
export function ExternalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExternalUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      try {
        const newAccess = await refreshAccessToken();
        if (cancelled) return;

        if (!newAccess) {
          setLoading(false);
          return;
        }

        setAccessToken(newAccess);
        setToken(newAccess);

        // Hydrate the user profile from the API.
        // Imported lazily to avoid a circular dep with accountService.
        try {
          const { getProfile } = await import("@/services/accountService");
          const profile = await getProfile();
          if (!cancelled) setUser(normalizeUser(profile));
        } catch (e) {
          console.warn("[auth] failed to load profile after refresh:", e);
          // Refresh succeeded but profile failed — clear the session.
          if (!cancelled) {
            setAccessToken(null);
            clearRefreshToken();
            setToken(null);
          }
        }
      } catch {
        clearRefreshToken();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((payload: LoginPayload) => {
    const normalized = normalizeUser(payload.user);
    setAccessToken(payload.access_token);
    setRefreshToken(payload.refresh_token);
    setToken(payload.access_token);
    setUser(normalized);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setAccessToken(null);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <ExternalAuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </ExternalAuthContext.Provider>
  );
}

export function useExternalAuth() {
  const context = useContext(ExternalAuthContext);
  if (!context) {
    throw new Error("useExternalAuth must be used within an ExternalAuthProvider");
  }
  return context;
}
