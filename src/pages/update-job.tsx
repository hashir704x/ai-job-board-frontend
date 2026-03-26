import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobById, updateJob } from "@/lib/api-functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";

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

export default function UpdateJob() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId;

  const { data, isPending, error } = useQuery({
    queryKey: ["get-job-by-id", id],
    queryFn: () => getJobById(id as string),
    enabled: !!id,
  });

  const initialRef = useRef<{
    title: string;
    description: string;
    wage: number;
    wageInterval: "hourly" | "yearly";
    locationRequirement: "in-office" | "hybrid" | "remote";
    status: "draft" | "delisted" | "published";
    type: "internship" | "part-time" | "full-time";
    experienceLevel: "junior" | "senior" | "mid-level";
  } | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wage, setWage] = useState("");
  const [wageInterval, setWageInterval] = useState<"hourly" | "yearly">(
    "yearly",
  );
  const [locationRequirement, setLocationRequirement] = useState<
    "in-office" | "hybrid" | "remote"
  >("remote");
  const [status, setStatus] = useState<"draft" | "delisted" | "published">(
    "draft",
  );
  const [type, setType] = useState<"internship" | "part-time" | "full-time">(
    "full-time",
  );
  const [experienceLevel, setExperienceLevel] = useState<
    "junior" | "senior" | "mid-level"
  >("mid-level");

  useEffect(() => {
    if (!data) return;
    if (initialRef.current) return;

    initialRef.current = {
      title: data.title,
      description: data.description,
      wage: data.wage,
      wageInterval: data.wageInterval,
      locationRequirement: data.locationRequirement,
      status: data.status,
      type: data.type,
      experienceLevel: data.experienceLevel,
    };

    setTitle(data.title);
    setDescription(data.description);
    setWage(String(data.wage ?? ""));
    setWageInterval(data.wageInterval);
    setLocationRequirement(data.locationRequirement);
    setStatus(data.status);
    setType(data.type);
    setExperienceLevel(data.experienceLevel);
  }, [data]);

  const payload = useMemo((): UpdateJobPayload => {
    const initial = initialRef.current;
    if (!initial) return {};

    const next: UpdateJobPayload = {};

    if (title.trim() !== initial.title) next.title = title.trim();
    if (description.trim() !== initial.description)
      next.description = description.trim();

    const wageNumber = wage === "" ? NaN : Number(wage);
    if (!Number.isNaN(wageNumber) && wageNumber !== initial.wage) {
      next.wage = wageNumber;
    }

    if (wageInterval !== initial.wageInterval) next.wageInterval = wageInterval;
    if (locationRequirement !== initial.locationRequirement)
      next.locationRequirement = locationRequirement;
    if (status !== initial.status) next.status = status;
    if (type !== initial.type) next.type = type;
    if (experienceLevel !== initial.experienceLevel)
      next.experienceLevel = experienceLevel;

    return next;
  }, [
    title,
    description,
    wage,
    wageInterval,
    locationRequirement,
    status,
    type,
    experienceLevel,
  ]);

  const hasChanges = Object.keys(payload).length > 0;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Missing job id");
      if (!hasChanges) return;
      await updateJob(id, payload);
    },
    onSuccess: async () => {
       queryClient.invalidateQueries({ queryKey: ["get-job-by-id", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", organizationId] });
      navigate(`/app/job-details/${id}`, { replace: true });
    },
    onError: (error) => {
      console.error("Error updating job", error);
      alert(error.message || "Failed to update job");
    },
  });

  if (!id) {
    return (
      <div className="p-4">
        <div className="max-w-3xl mx-auto border rounded-xl p-6 bg-card space-y-2">
          <div className="text-lg font-semibold">Update job</div>
          <div className="text-sm text-muted-foreground">
            Missing job id in the URL.
          </div>
          <Link to="/app/employer-dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="p-4">
        <div className="max-w-3xl mx-auto border rounded-xl p-6 bg-card">
          <div className="text-center text-2xl animate-pulse">
            Loading job...
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

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Update Job</h1>
            <div className="text-sm text-muted-foreground">
              Job ID: <span className="font-mono">{id}</span>
            </div>
          </div>
          <Link to={`/app/job-details/${id}`}>
            <Button variant="outline">Back</Button>
          </Link>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="border rounded-xl bg-card p-6 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[140px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wage">Wage</Label>
              <Input
                id="wage"
                type="number"
                value={wage}
                onChange={(e) => setWage(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">
                Leave it unchanged to not update wage.
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wageInterval">Wage Interval</Label>
              <Select
                value={wageInterval}
                onValueChange={(v) => setWageInterval(v as "hourly" | "yearly")}
              >
                <SelectTrigger id="wageInterval" className="w-full">
                  <SelectValue placeholder="Select wage interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationRequirement">Location Requirement</Label>
              <Select
                value={locationRequirement}
                onValueChange={(v) =>
                  setLocationRequirement(v as "in-office" | "hybrid" | "remote")
                }
              >
                <SelectTrigger id="locationRequirement" className="w-full">
                  <SelectValue placeholder="Select location requirement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-office">In-office</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) =>
                  setStatus(v as "draft" | "delisted" | "published")
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="delisted">Delisted</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(v) =>
                  setType(v as "internship" | "part-time" | "full-time")
                }
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={experienceLevel}
                onValueChange={(v) =>
                  setExperienceLevel(v as "junior" | "senior" | "mid-level")
                }
              >
                <SelectTrigger id="experienceLevel" className="w-full">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid-level">Mid-level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {mutation.isError && (
            <div className="text-sm text-red-500">
              {(mutation.error as Error).message}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to={`/app/job-details/${id}`}
              className="text-sm text-blue-500 bg-blue-500/10 px-3 py-2 rounded-md"
            >
              Cancel
            </Link>
            <Button type="submit" disabled={mutation.isPending || !hasChanges}>
              {mutation.isPending ? "Updating..." : "Update Job"}
            </Button>
          </div>

          {!hasChanges && (
            <div className="text-xs text-muted-foreground text-right">
              No changes to update.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
