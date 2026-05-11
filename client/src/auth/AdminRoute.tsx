import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";


// This component is used to hide any UI that is only visible to admins
// May be obsolete since our admin functionality is build on top of the existing user model.
export function AdminRoute({ children }: { children: React.ReactNode }) {
    const { admin, loading } = useAuth();

    if (loading) return <p>Loading...</p>;
    if (admin !== "admin") return <Navigate to="/" replace />;

    return <>{children}</>;
}