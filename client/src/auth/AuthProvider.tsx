import { useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";
import { getCurrentUser } from "../api/authApi";

export interface GoogleUser {
  id: string;
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
  hasAccount: boolean;
  admin: "admin" | "user";
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, []);

  const refresh = async () => {
    await fetchUser();
  };

  const logout = () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        hasAccount: user?.hasAccount ?? false,
        loading,
        logout,
        refresh,
        admin: user?.admin ?? "user",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};