import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

/**
 * Guards routes that belong to a person's own account rather than to an active
 * membership — their profile, their details, their profile picture.
 *
 * "legacy" is allowed through deliberately: it means someone whose membership
 * has lapsed, not someone without an account. Locking them out stranded their
 * own data behind an expired payment, while the header still offered them a
 * Profile link that silently bounced them home.
 *
 * Anything that is genuinely a membership perk needs its own guard that checks
 * for "member" — this one deliberately does not.
 */
export function AccountRoute({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (role === "guest") return <Navigate to="/" replace />;

  return <>{children}</>;
}
