import { useQuery } from "@tanstack/react-query";
import { getJobsForOrganization } from "@/lib/api-functions";
import { Link } from "react-router";
import PageLoader from "@/components/loading/page-loader";

export default function JobsList({
  organizationId,
}: {
  organizationId: string;
}) {
  const { data, isPending, error } = useQuery({
    queryKey: ["jobs", organizationId],
    queryFn: getJobsForOrganization,
  });

  if (isPending) {
    return <PageLoader title="Jobs" message="Loading jobs..." size="md" />;
  }

  if (error) {
    return (
      <div className="mt-6 border rounded-xl p-8 bg-card text-center">
        <div className="text-lg font-semibold text-destructive">
          Error loading jobs
        </div>
        <div className="text-sm text-muted-foreground mt-2">{error.message}</div>
        <div className="text-xs text-muted-foreground mt-2">
          Try switching organization or refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Jobs</h2>
        <Link to="/app/create-job">
          <span className="inline-flex items-center justify-center rounded-lg border bg-primary/10 text-primary px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/15">
            Create job
          </span>
        </Link>
      </div>

      {data?.length === 0 ? (
        <div className="mt-6 border rounded-xl p-8 bg-card text-center">
          <div className="text-lg font-semibold">No jobs found</div>
          <div className="text-sm text-muted-foreground mt-1">
            Create your first listing to get started.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {data?.map((job) => (
            <Link
              to={`/app/job-details/${job.id}`}
              key={job.id}
              className="border rounded-xl bg-card p-4 transition-all duration-200 hover:bg-accent hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold leading-6 line-clamp-2">
                  {job.title}
                </h3>
                <span className="text-xs px-2 py-1 rounded-md border bg-background text-muted-foreground">
                  {job.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {job.type || "—"}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Created: {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
