import { createContext } from "react";
import type { GoogleUser } from "./AuthProvider";

export interface AuthContextType {
  user: GoogleUser | null;
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});
