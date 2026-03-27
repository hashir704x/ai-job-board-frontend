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
  wage: number;
  wageInterval: "hourly" | "yearly";
  locationRequirement: "in-office" | "hybrid" | "remote";
  type: "internship" | "part-time" | "full-time";
  experienceLevel: "junior" | "senior" | "mid-level";
  isFeatured: boolean;
};

export async function createJob(payload: CreateJobPayload): Promise<string> {
  const response = await fetch(`${backendUrl}/api/jobs/create-job`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data.id;
}

type JobDetailsResponseType = {
  id: string;
  title: string;
  description: string;
  wage: number;
  wageInterval: "hourly" | "yearly";
  locationRequirement: "in-office" | "hybrid" | "remote";
  status: "draft" | "delisted" | "published";
  type: "internship" | "part-time" | "full-time";
  experienceLevel: "junior" | "senior" | "mid-level";
  createdAt: Date;
  updatedAt: Date;
  postedAt: Date | null;
  isFeatured: boolean;
  organizationId: string;
};

export async function getJobById(id: string): Promise<JobDetailsResponseType> {
  const response = await fetch(`${backendUrl}/api/jobs/get-job-by-id/${id}`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
}


type UpdateJobPayload = {
  title?: string;
  description?: string;
  wage?: number;
  wageInterval?: "hourly" | "yearly";
  locationRequirement?: "in-office" | "hybrid" | "remote";
  status?: "draft" | "delisted" | "published";
  type?: "internship" | "part-time" | "full-time";
  experienceLevel?: "junior" | "senior" | "mid-level";
};


export async function updateJob(
  id: string,
  payload: UpdateJobPayload,
): Promise<void> {
  const response = await fetch(`${backendUrl}/api/jobs/update-job/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
}
