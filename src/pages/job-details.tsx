import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobById, updateJob } from "@/lib/api-functions";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/page-shell";
import PageLoader from "@/components/loading/page-loader";
import { Separator } from "@/components/ui/separator";
import UpdateJobStatusDialog from "@/components/update-job-status-dialog";
import type { JobListingStatus } from "@/components/update-job-status-dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  DollarSignIcon,
  MapPinIcon,
  PencilIcon,
  SparklesIcon
} from "lucide-react";
import { useState } from "react";

function formatDateTime(value: unknown) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusStyles(status: JobListingStatus) {
  switch (status) {
    case "published":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
    case "draft":
      return "border-muted-foreground/25 bg-muted text-muted-foreground";
    case "delisted":
      return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300";
    default:
      return "border-border bg-muted";
  }
}

function formatLabel(value: string | null | undefined, fallback = "—"): string {
  if (value == null || value === "") return fallback;
  return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function JobDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const { data, isPending, error } = useQuery({
    queryFn: () => getJobById(id as string),
    queryKey: ["get-job-by-id", id],
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: JobListingStatus) => updateJob(data!.id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-job-by-id", id] });
      if (data?.organizationId) {
        queryClient.invalidateQueries({
          queryKey: ["jobs", data.organizationId],
        });
      }
    },
  });

  const formatWage = () => {
    if (!data) return "—";
    if (typeof data.wage !== "number") return "—";
    const amount = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(data.wage);
    const interval = data.wageInterval === "hourly" ? "hour" : "year";
    return `${amount} / ${interval}`;
  };

  if (!id) {
    return (
      <PageShell
        size="md"
        title="Job not found"
        description="Missing job id in the URL."
        actions={
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link to="/app/employer-dashboard" />}
          >
            Back
          </Button>
        }
      >
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Check the link or return to your dashboard.
          </p>
        </div>
      </PageShell>
    );
  }

  if (isPending) {
    return (
      <PageLoader title="Job listing" message="Loading listing details…" />
    );
  }

  if (error) {
    return (
      <PageShell
        size="md"
        title="Something went wrong"
        description={error.message}
        actions={
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link to="/app/employer-dashboard" />}
          >
            Back to dashboard
          </Button>
        }
      >
        <div className="rounded-2xl border border-destructive/20 bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Try again or open the job from your employer dashboard.
          </p>
        </div>
      </PageShell>
    );
  }

  if (!data) {
    return (
      <PageShell size="md" title="Job listing">
        <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
          No listing data was returned.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      size="lg"
      title={data.title}
      description={
        <>
          {formatLabel(data.type)} · {formatLabel(data.experienceLevel)} ·{" "}
          {formatLabel(data.locationRequirement)}
          {data.isFeatured ? " · Featured" : ""}
        </>
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link to="/app/employer-dashboard" />}
          >
            <ArrowLeftIcon className="size-4" aria-hidden />
            Dashboard
          </Button>
          <Button
            variant="default"
            size="sm"
            nativeButton={false}
            render={<Link to={`/app/update-job/${data.id}`} />}
          >
            <PencilIcon className="size-4" aria-hidden />
            Edit listing
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <nav
          className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link
            to="/app/employer-dashboard"
            className="hover:text-foreground transition-colors"
          >
            Employer dashboard
          </Link>
          <ChevronRightIcon className="size-4 shrink-0 opacity-60" />
          <span className="line-clamp-1 font-medium text-foreground">
            {data.title}
          </span>
        </nav>

        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          <div className="flex flex-col gap-4 bg-gradient-to-br from-muted/50 to-muted/15 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize",
                  statusStyles(data.status),
                )}
              >
                {data.status}
              </span>
              {data.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <SparklesIcon className="size-3.5" aria-hidden />
                  Featured
                </span>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto shrink-0"
              onClick={() => setStatusDialogOpen(true)}
            >
              Update status
            </Button>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6 px-6 py-8 sm:px-8 lg:border-r lg:border-border/80">
              <section>
                <h2 className="text-sm font-semibold tracking-tight">
                  Description
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  What candidates read on the public listing
                </p>
                <div className="mt-4 rounded-xl border bg-muted/15 px-4 py-5 sm:px-5">
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                    {data.description}
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6 bg-muted/10 px-6 py-8 sm:px-8 lg:px-6">
              <div>
                <h2 className="text-sm font-semibold tracking-tight">
                  At a glance
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Compensation and timeline
                </p>
              </div>

              <ul className="space-y-0 divide-y divide-border/80 rounded-xl border border-border/80 bg-background/80">
                <li className="flex gap-3 px-4 py-3.5">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <DollarSignIcon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-muted-foreground">
                      Compensation
                    </div>
                    <div className="text-sm font-medium">{formatWage()}</div>
                  </div>
                </li>
                <li className="flex gap-3 px-4 py-3.5">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BriefcaseIcon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-muted-foreground">
                      Employment type
                    </div>
                    <div className="text-sm font-medium">
                      {formatLabel(data.type)}
                    </div>
                  </div>
                </li>
                <li className="flex gap-3 px-4 py-3.5">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPinIcon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-muted-foreground">
                      Location
                    </div>
                    <div className="text-sm font-medium">
                      {formatLabel(data.locationRequirement)}
                    </div>
                  </div>
                </li>
              </ul>

              <Separator className="bg-border/80" />

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Timeline
                </h3>
                <ul className="mt-3 space-y-3 text-sm">
                  <li className="flex gap-2">
                    <CalendarIcon
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Posted
                      </div>
                      <div className="font-medium">
                        {formatDateTime(data.postedAt)}
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <ClockIcon
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Created
                      </div>
                      <div className="font-medium">
                        {formatDateTime(data.createdAt)}
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <ClockIcon
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Last updated
                      </div>
                      <div className="font-medium">
                        {formatDateTime(data.updatedAt)}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-dashed border-border/80 bg-background/50 px-3 py-2.5">
                <div className="text-xs text-muted-foreground">Listing ID</div>
                <div className="mt-0.5 font-mono text-xs break-all text-foreground">
                  {data.id}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <UpdateJobStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        currentStatus={data.status}
        onUpdate={(status) => updateStatusMutation.mutateAsync(status)}
      />
    </PageShell>
  );
}
