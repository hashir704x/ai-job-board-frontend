import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getJobById } from "@/lib/api-functions";
import { Button } from "@/components/ui/button";

export default function JobDetails() {
  const { id } = useParams();

  const { data, isPending, error } = useQuery({
    queryFn: () => getJobById(id as string),
    queryKey: ["get-job-by-id", id],
    enabled: !!id,
  });

  const formatDateTime = (value: unknown) => {
    if (!value) return "—";
    const d = value instanceof Date ? value : new Date(value as string);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  };

  const formatWage = () => {
    if (!data) return "—";
    if (typeof data.wage !== "number") return "—";
    const amount = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(data.wage);
    return `${amount} / ${data.wageInterval}`;
  };

  if (!id) {
    return (
      <div className="p-4">
        <div className="max-w-3xl mx-auto border rounded-xl p-6 bg-card space-y-2">
          <div className="text-lg font-semibold">Job not found</div>
          <div className="text-sm text-muted-foreground">
            Missing job id in the URL.
          </div>
          <div className="pt-2">
            <Link to="/app/employer-dashboard">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="p-4">
        <div className="max-w-3xl mx-auto border rounded-xl p-6 bg-card">
          <div className="text-center text-2xl animate-pulse">
            Loading job details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="max-w-3xl mx-auto border rounded-xl p-6 bg-card space-y-3">
          <div className="text-xl font-semibold text-red-500">
            Error loading job
          </div>
          <div className="text-sm text-muted-foreground">{error.message}</div>
          <Link to="/app/employer-dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4">
        <div className="max-w-3xl mx-auto border rounded-xl p-6 bg-card">
          <div className="text-center text-sm text-muted-foreground">
            No data found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{data.title}</h1>
            <div className="text-sm text-muted-foreground">
              Job ID: <span className="font-mono">{data.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/app/employer-dashboard">
              <Button variant="outline">Back</Button>
            </Link>
            <Link to={`/app/update-job/${data.id}`}>
              <Button variant="outline">Update</Button>
            </Link>
          </div>
        </div>

        <div className="border rounded-xl bg-card p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 rounded-md border bg-background">
              Status: <span className="font-medium">{data.status}</span>
            </span>
            <span className="text-xs px-2 py-1 rounded-md border bg-background">
              Type: <span className="font-medium">{data.type}</span>
            </span>
            <span className="text-xs px-2 py-1 rounded-md border bg-background">
              Level: <span className="font-medium">{data.experienceLevel}</span>
            </span>
            <span className="text-xs px-2 py-1 rounded-md border bg-background">
              Location:{" "}
              <span className="font-medium">{data.locationRequirement}</span>
            </span>
            {data.isFeatured && (
              <span className="text-xs px-2 py-1 rounded-md border bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                Featured
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border bg-background p-3">
              <div className="text-xs text-muted-foreground">Wage</div>
              <div className="font-medium">{formatWage()}</div>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <div className="text-xs text-muted-foreground">Organization</div>
              <div className="font-mono text-xs break-all">
                {data.organizationId}
              </div>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <div className="text-xs text-muted-foreground">Posted at</div>
              <div className="font-medium">{formatDateTime(data.postedAt)}</div>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <div className="text-xs text-muted-foreground">Created at</div>
              <div className="font-medium">
                {formatDateTime(data.createdAt)}
              </div>
            </div>
            <div className="rounded-lg border bg-background p-3 sm:col-span-2">
              <div className="text-xs text-muted-foreground">Updated at</div>
              <div className="font-medium">
                {formatDateTime(data.updatedAt)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Description</div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-6">
              {data.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
