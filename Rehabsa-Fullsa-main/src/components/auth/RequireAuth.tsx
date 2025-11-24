import { Navigate, Outlet, useLocation } from "react-router-dom";

type Role = "admin" | "merchant" | "staff" | "customer" | string;

interface RequireAuthProps {
  allowedRoles?: Role[];
  redirectTo?: string;
}

const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }
  const token = localStorage.getItem("auth_token");
  const userRaw = localStorage.getItem("auth_user");
  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }
  return { token, user };
};

export function RequireAuth({ allowedRoles, redirectTo = "/login" }: RequireAuthProps) {
  const location = useLocation();
  const { token, user } = getStoredAuth();

  const hasToken = !!token && !!user;
  const hasRoleAccess =
    !allowedRoles ||
    !user?.role ||
    allowedRoles.map((r) => r.toLowerCase()).includes(String(user.role).toLowerCase());

  if (!hasToken) {
    const redirectParam = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${redirectTo}?redirect=${redirectParam}`} replace />;
  }

  if (!hasRoleAccess) {
    // مستخدم مصادق لكن غير مصرح له - أعد توجيهه للوحة التاجر
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
