import { useCallback, useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";
import type { Role } from "./AuthContext";
import { getCurrentUser } from "../api/authApi";

export interface GoogleUser {
  id: string;
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
  hasAccount: boolean;
  role: Role;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await getCurrentUser();
      setUser(res ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  const refresh = async () => {
    setLoading(true);

    try {
      const res = await getCurrentUser();
      setUser(res ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    globalThis.location.href = "/api/auth/logout";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        hasAccount: user?.hasAccount ?? false,
        loading,
        logout,
        refresh,
        role: user?.role ?? "guest",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
