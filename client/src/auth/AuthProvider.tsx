import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export interface GoogleUser {
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    window.location.href = "/auth/logout";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
