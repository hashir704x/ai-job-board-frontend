import { useQuery } from "@tanstack/react-query";
import { getJobsForOrganization } from "@/lib/api-functions";
import { Link } from "react-router";

export default function JobsList({
  organizationId,
}: {
  organizationId: string;
}) {
  const { data, isPending, error } = useQuery({
    queryKey: ["jobs", organizationId],
    queryFn: getJobsForOrganization,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">Jobs List</h1>

      {isPending && (
        <div className="text-center text-2xl animate-pulse">Loading...</div>
      )}
      {error && (
        <div className="text-center text-2xl text-red-500">
          Error: {error.message}
        </div>
      )}
      {data?.length === 0 ? (
        <div className="text-center text-2xl flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">No jobs found</h1>

          <Link
            to="/app/create-job"
            className="text-blue-500 bg-blue-500/10 px-4 py-2 rounded-md"
          >
            Create job
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((job) => (
            <div key={job.id} className="border p-4 rounded-md">
              <h2 className="text-lg font-bold">{job.title}</h2>
              <p className="text-sm text-gray-500">{job.type}</p>
              <p className="text-sm text-gray-500">{job.status}</p>
              <p className="text-sm text-gray-500">
                {job.createdAt.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
