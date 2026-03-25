import { authClient } from "@/lib/auth-client";
import { Navigate } from "react-router";
import JobsList from "@/components/jobs-list";

export default function EmployerDashboard() {
  const { data } = authClient.useSession();

  const {
    data: organizations,
    isPending: organizationsPending,
    error: organizationsError,
  } = authClient.useListOrganizations();

  if (organizationsPending)
    return (
      <div className="text-center text-2xl animate-pulse">
        Getting your organizations...
      </div>
    );
  if (organizationsError)
    return (
      <div className="text-center text-2xl text-red-500">
        Error in getting your organizations:{" "}
        {organizationsError?.message || "Unknown error"}
      </div>
    );

  if (organizations?.length === 0)
    return <Navigate to="/app/create-organization" replace />;

  const activeOrganization = organizations?.find(
    (org) => org.id === data?.session.activeOrganizationId,
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">Employer Dashboard</h1>

      {!activeOrganization ? (
        <div className="text-center text-2xl text-red-500">
          No active organization
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-center">
            Active Organization: {activeOrganization?.name}
          </h2>

          <JobsList organizationId={activeOrganization.id} />
        </div>
      )}
    </div>
  );
}
