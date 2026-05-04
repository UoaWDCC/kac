import { createContext } from "react";
import type { GoogleUser } from "./AuthProvider";

export interface AuthContextType {
  user: GoogleUser | null;
  hasAccount: boolean;
  loading: boolean;
  logout: () => void;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  hasAccount: false,
  loading: true,
  logout: () => { },
  refresh: async () => { },
});