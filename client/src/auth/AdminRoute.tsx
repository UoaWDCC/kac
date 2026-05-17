import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export function AdminRoute({ children }: Readonly<{ children: React.ReactNode }>) {
  const { role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}