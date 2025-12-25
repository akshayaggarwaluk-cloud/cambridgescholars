import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import * as authApi from "@/services/authApi";
import type { User } from "@/services/authApi";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    authApi.getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { user, error } = await authApi.signUp(email, password, fullName);
    if (user) {
      setUser(user);
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { user, error } = await authApi.signIn(email, password);
    if (user) {
      setUser(user);
    }
    return { error };
  };

  const signInWithGoogle = async () => {
    const { user, error } = await authApi.signInWithGoogle();
    if (user) {
      setUser(user);
    }
    return { error };
  };

  const signOut = async () => {
    await authApi.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
