import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  getAuthToken, 
  setAuthToken as saveToken, 
  removeAuthToken,
  isAuthenticated as checkAuth 
} from "@/services/authService";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ExternalUser {
  id: string;
  email: string;
  username: string;
  name?: string;
}

interface ExternalAuthContextType {
  user: ExternalUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: ExternalUser) => void;
  logout: () => void;
}

// =============================================================================
// STORAGE KEYS
// =============================================================================

const USER_STORAGE_KEY = "authUser";

// =============================================================================
// CONTEXT
// =============================================================================

const ExternalAuthContext = createContext<ExternalAuthContextType | undefined>(undefined);

export function ExternalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExternalUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as ExternalUser;
        setToken(storedToken);
        setUser(parsedUser);
      } catch {
        // Invalid stored data, clear it
        removeAuthToken();
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: ExternalUser) => {
    saveToken(newToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

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
