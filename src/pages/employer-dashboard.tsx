import { authClient } from "@/lib/auth-client";
import { Link, Navigate } from "react-router";
import JobsList from "@/components/jobs-list";
import { useState } from "react";
import PageShell from "@/components/page-shell";
import PageLoader from "@/components/loading/page-loader";
import SwitchOrganizationDialog from "@/components/switch-organization-dialog";
import { Button } from "@/components/ui/button";

export default function EmployerDashboard() {
  const { data } = authClient.useSession();
  const [switchDialogOpen, setSwitchDialogOpen] = useState(false);

  const {
    data: organizations,
    isPending: organizationsPending,
    error: organizationsError,
  } = authClient.useListOrganizations();

  const activeOrganization = organizations?.find(
    (org) => org.id === data?.session.activeOrganizationId,
  );

  async function handleSwitchOrganization(organizationId: string) {
    await authClient.organization.setActive(
      { organizationId },
      {
        onError: (ctx) => {
          throw new Error(
            ctx.error.message || "Failed to switch organization",
          );
        },
      },
    );
  }

  if (organizationsPending)
    return (
      <PageLoader
        title="Employer dashboard"
        message="Getting your organizations..."
        size="md"
      />
    );

  if (organizationsError)
    return (
      <PageShell
        size="md"
        title="Employer dashboard"
        description="Could not load organizations."
      >
        <div className="border rounded-xl p-6 bg-card space-y-2">
          <div className="text-sm font-medium text-destructive">
            Error loading organizations
          </div>
          <div className="text-sm text-muted-foreground">
            {organizationsError?.message || "Unknown error"}
          </div>
        </div>
      </PageShell>
    );

  if (organizations?.length === 0)
    return <Navigate to="/app/create-organization" replace />;

  return (
    <PageShell
      size="md"
      title="Employer dashboard"
      description="Manage your organizations and job listings."
      actions={
        <Link
          to="/app/create-organization"
          className="text-sm text-primary bg-primary/10 px-3 py-2 rounded-md border border-primary/20 transition-colors hover:bg-primary/15"
        >
          Create organization
        </Link>
      }
    >
      <div className="border rounded-xl bg-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Your organizations</div>
            <div className="text-xs text-muted-foreground">
              Active: {activeOrganization?.name || "—"}
            </div>
          </div>
          {(organizations?.length ?? 0) > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSwitchDialogOpen(true)}
            >
              Switch organization
            </Button>
          )}
        </div>
      </div>

      <SwitchOrganizationDialog
        open={switchDialogOpen}
        onOpenChange={setSwitchDialogOpen}
        organizations={organizations ?? []}
        activeOrganizationId={data?.session.activeOrganizationId}
        onSwitch={handleSwitchOrganization}
      />

      {activeOrganization && <JobsList organizationId={activeOrganization.id} />}
    </PageShell>
  );
}
