import { createContext } from "react";
import type { AuthSuccessResponse, AuthUserData } from "@/services/authService";

export interface ExternalUser {
  id: string;
  email: string;
  username: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginPayload {
  access_token: string;
  refresh_token: string;
  user: AuthUserData;
}

export interface ExternalAuthContextType {
  user: ExternalUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload | AuthSuccessResponse) => void;
  logout: () => Promise<void>;
}

export const ExternalAuthContext = createContext<ExternalAuthContextType | undefined>(undefined);
