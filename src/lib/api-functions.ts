const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (!backendUrl) {
  throw new Error("Backend url env not set!");
}

type JobsListResponseType = {
  id: string;
  title: string;
  type: "internship" | "part-time" | "full-time" | null;
  status: "draft" | "delisted" | "published";
  createdAt: Date;
};

export async function getJobsForOrganization(): Promise<
  JobsListResponseType[]
> {
  const response = await fetch(`${backendUrl}/api/jobs/get-organization-jobs`, {
    credentials: "include",
  });
  const data = await response.json();
  return data.data;
}

type CreateJobPayload = {
  title: string;
  description: string;
  wage: number | undefined;
  wageInterval: "hourly" | "yearly";
  locationRequirement: "in-office" | "hybrid" | "remote";
  status: "draft" | "delisted" | "published";
  type: "internship" | "part-time" | "full-time";
  experienceLevel: "junior" | "senior" | "mid-level";
};

export async function createJob(payload: CreateJobPayload) {
  const response = await fetch(`${backendUrl}/api/jobs/create-job`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data.data;
}
