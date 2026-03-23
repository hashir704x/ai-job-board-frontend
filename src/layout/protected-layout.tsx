import { Navigate, Outlet } from "react-router";
import { authClient } from "@/lib/auth-client";

export default function ProtectedLayout() {
  const { data } = authClient.useSession();

  if (!data) return <Navigate to="/login" />;
  return <Outlet />;
}
