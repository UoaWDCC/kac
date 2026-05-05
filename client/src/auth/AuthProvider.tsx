import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export interface GoogleUser {
  id: string;
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
  hasAccount: boolean;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      setUser(res.data);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
