import { authClient } from "@/lib/auth-client";
import { Navigate } from "react-router";

export default function EmployerDashboard() {
  const { data, isPending, error } = authClient.useSession();
  const {
    data: organizations,
    isPending: organizationsPending,
    error: organizationsError,
  } = authClient.useListOrganizations();

  if (isPending || organizationsPending)
    return (
      <div className="text-center text-2xl animate-pulse">
        Getting your organizations...
      </div>
    );
  if (error || organizationsError)
    return (
      <div className="text-center text-2xl text-red-500">
        Error in getting your organizations:{" "}
        {error?.message || organizationsError?.message || "Unknown error"}
      </div>
    );

  if (organizations?.length === 0)
    return <Navigate to="/app/create-organization" replace />;

  console.log("organizations:", organizations);
  console.log(data?.session.activeOrganizationId);

  return <div>EmployerDashboard</div>;
}
