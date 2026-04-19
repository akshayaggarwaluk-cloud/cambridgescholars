import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import {
  setAccessToken,
  refreshAccessToken,
  setRefreshToken,
  clearRefreshToken,
  logout as apiLogout,
  type AuthSuccessResponse,
  type AuthUserData,
} from "@/services/authService";

// ── Types ────────────────────────────────────────────────────────

export interface ExternalUser {
  id: string;
  email: string;
  username: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

interface LoginPayload {
  access_token: string;
  refresh_token: string;
  user: AuthUserData;
}

interface ExternalAuthContextType {
  user: ExternalUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload | AuthSuccessResponse) => void;
  logout: () => Promise<void>;
}

// ── Storage keys ────────────────────────────────────────────────

const USER_STORAGE_KEY = "authUser";

// ── Helpers ─────────────────────────────────────────────────────

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

// ── Context ─────────────────────────────────────────────────────

const ExternalAuthContext = createContext<ExternalAuthContextType | undefined>(undefined);

export function ExternalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExternalUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount: try to refresh access token using stored refresh token
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(storedUser) as ExternalUser;
        const newAccess = await refreshAccessToken();

        if (cancelled) return;

        if (newAccess) {
          setAccessToken(newAccess);
          setToken(newAccess);
          setUser(parsed);
        } else {
          // Refresh failed — clear stale data
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
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
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalized));
    setToken(payload.access_token);
    setUser(normalized);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setAccessToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
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
