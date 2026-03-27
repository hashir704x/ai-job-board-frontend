import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageShell from "@/components/page-shell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createJob } from "@/lib/api-functions";
import {
  BriefcaseIcon,
  ChevronRightIcon,
  DollarSignIcon,
  Loader2Icon,
  MapPinIcon,
  SparklesIcon,
} from "lucide-react";

type WageInterval = "hourly" | "yearly";
type LocationRequirement = "in-office" | "hybrid" | "remote";
type ExperienceLevel = "junior" | "senior" | "mid-level";
type JobListingType = "internship" | "part-time" | "full-time";

export default function CreateJob() {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const organizationId = data?.session.activeOrganizationId;

  if (!organizationId) {
    return (
      <PageShell
        title="Create job"
        description="Cannot create job without an active organization."
        size="md"
        actions={
          <Button variant="outline" size="sm" nativeButton={false} render={<Link to="/app/employer-dashboard" />}>
            Go to dashboard
          </Button>
        }
      >
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Choose an organization on your employer dashboard, then return here
            to publish a role.
          </p>
        </div>
      </PageShell>
    );
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wage, setWage] = useState("");
  const [wageInterval, setWageInterval] = useState<WageInterval>("hourly");
  const [isFeatured, setIsFeatured] = useState(false);
  const [locationRequirement, setLocationRequirement] =
    useState<LocationRequirement>("remote");
  const [type, setType] = useState<JobListingType>("full-time");
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("mid-level");

  const { mutate: createJobMutation, isPending: isCreatingJob } = useMutation({
    mutationFn: async () => {
      return await createJob(submitValues());
    },
    onSuccess: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: ["jobs", organizationId],
      });
      navigate(`/app/job-details/${id}`);
    },
    onError: (error) => {
      console.error("Error creating job", error);
      alert(error.message || "Failed to create job");
    },
  });

  const submitValues = () => ({
    title: title.trim(),
    description: description.trim(),
    wage: Number(wage),
    wageInterval,
    isFeatured,
    locationRequirement,
    type,
    experienceLevel,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please enter a job title and description.");
      return;
    }

    const wageNum = Number(wage);
    if (
      wage.trim() === "" ||
      !Number.isFinite(wageNum) ||
      wageNum <= 0
    ) {
      alert("Please enter a valid wage greater than zero.");
      return;
    }

    createJobMutation();
  };

  return (
    <PageShell
      title="Create a job"
      description="Add a new listing for your organization. All fields are required."
      size="lg"
      actions={
        <Button variant="outline" size="sm" nativeButton={false} render={<Link to="/app/employer-dashboard" />}>
          Back to jobs
        </Button>
      }
    >
      <div className="space-y-5">
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
          <span className="font-medium text-foreground">New listing</span>
        </nav>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
        >
          <div className="border-b bg-gradient-to-br from-muted/50 to-muted/20 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold tracking-tight">
              Job listing
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Candidates see this information on your public listing.
            </p>
          </div>

          <div className="space-y-10 px-6 py-8 sm:px-8">
            <section className="space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BriefcaseIcon className="size-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">Role overview</h3>
                  <p className="text-xs text-muted-foreground">
                    Title, contract type, and seniority.
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Job title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior frontend engineer"
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Employment type</Label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as JobListingType)}
                  >
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience level</Label>
                  <Select
                    value={experienceLevel}
                    onValueChange={(v) =>
                      setExperienceLevel(v as ExperienceLevel)
                    }
                  >
                    <SelectTrigger id="experienceLevel" className="w-full">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid-level">Mid-level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPinIcon className="size-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">Work location</h3>
                  <p className="text-xs text-muted-foreground">
                    How this role is expected to work on-site vs remote.
                  </p>
                </div>
              </div>
              <div className="max-w-md space-y-2">
                <Label htmlFor="locationRequirement">Location setup</Label>
                <Select
                  value={locationRequirement}
                  onValueChange={(v) =>
                    setLocationRequirement(v as LocationRequirement)
                  }
                >
                  <SelectTrigger id="locationRequirement" className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-office">In-office</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            <Separator />

            <section className="space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <DollarSignIcon className="size-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">Compensation</h3>
                  <p className="text-xs text-muted-foreground">
                    Pay amount and whether it is hourly or annual.
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 sm:max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="wage">Amount</Label>
                  <Input
                    id="wage"
                    type="number"
                    inputMode="decimal"
                    min={1}
                    step="any"
                    value={wage}
                    onChange={(e) => setWage(e.target.value)}
                    placeholder="e.g. 85000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wageInterval">Interval</Label>
                  <Select
                    value={wageInterval}
                    onValueChange={(v) =>
                      setWageInterval(v as WageInterval)
                    }
                  >
                    <SelectTrigger id="wageInterval" className="w-full">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Per hour</SelectItem>
                      <SelectItem value="yearly">Per year (salary)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SparklesIcon className="size-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">Visibility</h3>
                  <p className="text-xs text-muted-foreground">
                    Highlight this role in featured placements when available.
                  </p>
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/20 p-4 transition-colors hover:bg-muted/35 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50">
                <input
                  id="isFeatured"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mt-1 size-4 rounded border-input accent-primary"
                />
                <div className="min-w-0">
                  <span className="text-sm font-medium">Featured listing</span>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    Mark this job for prominent display. You can change this
                    later when editing the listing.
                  </p>
                </div>
              </label>
            </section>

            <Separator />

            <section className="space-y-5">
              <div>
                <Label htmlFor="description" className="text-base">
                  Description
                </Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Responsibilities, requirements, and what makes this role a
                  strong fit.
                </p>
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe the role in detail..."
                rows={10}
                className="min-h-[220px] w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
              />
            </section>
          </div>

          <div className="flex flex-col gap-4 border-t bg-muted/25 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-xs text-muted-foreground">
              Listing is created for your active organization. Processing usually
              takes a moment.
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                nativeButton={false}
                render={<Link to="/app/employer-dashboard" />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingJob}
                className="w-full sm:w-auto min-w-[140px]"
              >
                {isCreatingJob && (
                  <Loader2Icon className="size-4 animate-spin" aria-hidden />
                )}
                {isCreatingJob ? "Creating…" : "Create listing"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
