import { authClient } from "@/lib/auth-client";
import { Link, Navigate } from "react-router";
import JobsList from "@/components/jobs-list";
import { useState } from "react";

export default function EmployerDashboard() {
  const { data } = authClient.useSession();
  const [isSwitching, setIsSwitching] = useState(false);

  const {
    data: organizations,
    isPending: organizationsPending,
    error: organizationsError,
  } = authClient.useListOrganizations();

  const activeOrganization = organizations?.find(
    (org) => org.id === data?.session.activeOrganizationId,
  );

  async function handleSwitch(orgId: string) {
    await authClient.organization.setActive(
      { organizationId: orgId },
      {
        onRequest: () => {
          setIsSwitching(true);
        },
        onSuccess: () => {
          setTimeout(() => {
            setIsSwitching(false);
          }, 500);
        },
        onError: (ctx) => {
          setIsSwitching(false);
          alert(ctx.error.message || "Failed to switch organization");
        },
      },
    );
  }

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

  return (
    <div className="p-4">
      {isSwitching && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-5 shadow-sm">
            <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" />
            <div className="text-sm font-medium">Switching organization...</div>
            <div className="text-xs text-muted-foreground">Please wait</div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-center">Employer Dashboard</h1>

      <div className="flex flex-col items-center gap-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Your Organizations
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {organizations?.map((org) => {
            const isActive = org.id === data?.session.activeOrganizationId;

            return (
              <button
                key={org.id}
                onClick={() => handleSwitch(org.id)}
                disabled={isActive || isSwitching}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary cursor-default shadow-md"
                    : "bg-background hover:bg-accent border-input"
                }`}
              >
                {org.name}
                {isActive && (
                  <span className="ml-2 text-xs opacity-80">(Active)</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-center">
          Active Organization: {activeOrganization?.name}
        </h2>

        <Link
          to="/app/create-organization"
          className="text-blue-500 bg-blue-500/10 px-4 py-2 rounded-md border block text-center mt-4 w-fit"
        >
          Create another organization
        </Link>

        {activeOrganization && (
          <JobsList organizationId={activeOrganization.id} />
        )}
      </div>
    </div>
  );
}
