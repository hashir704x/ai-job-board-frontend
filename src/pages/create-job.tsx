import { useState } from "react";
import { Link } from "react-router";
import { authClient } from "@/lib/auth-client";
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

export default function CreateJob() {
  const { data } = authClient.useSession();

  if (!data?.session.activeOrganizationId) {
    return (
      <div>
        <h1 className="text-2xl font-bold">
          Cannot create job without an active organization
        </h1>
        <Link
          to="/app/employer-dashboard"
          className="text-blue-500 bg-blue-500/10 px-4 py-2 rounded-md"
        >
          Go to employer dashboard
        </Link>
      </div>
    );
  }

  type WageInterval = "hourly" | "yearly";
  type LocationRequirement = "in-office" | "hybrid" | "remote";
  type ExperienceLevel = "junior" | "senior" | "mid-level";
  type JobListingStatus = "draft" | "delisted" | "published";
  type JobListingType = "internship" | "part-time" | "full-time";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wage, setWage] = useState(""); // optional integer
  const [wageInterval, setWageInterval] = useState<WageInterval | "">("");
  const [stateAbbreviation, setStateAbbreviation] = useState("");
  const [city, setCity] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [locationRequirement, setLocationRequirement] =
    useState<LocationRequirement>("remote");
  const [status, setStatus] = useState<JobListingStatus>("draft");
  const [type, setType] = useState<JobListingType | "">("");
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("mid-level");

  const [isLoading, setIsLoading] = useState(false);

  const submitValues = () => {
    const payload = {
      organizationId: data.session.activeOrganizationId,
      title: title.trim(),
      description: description.trim(),
      wage: wage ? Number(wage) : undefined,
      wageInterval: wageInterval || undefined,
      stateAbbreviation: stateAbbreviation.trim() || undefined,
      city: city.trim() || undefined,
      isFeatured,
      locationRequirement,
      status,
      type: type || undefined,
      experienceLevel,
    };

    return payload;
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill in title and description");
      return;
    }

    if (wage && !wageInterval) {
      alert("Select wage interval when wage is set");
      return;
    }

    setIsLoading(true);
    try {
      const values = submitValues();

      // TODO: send `values` to backend (for now you can inspect it here)
      console.log("Create job values:", values);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">Create Job</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 mx-auto max-w-4xl space-y-6 border p-6 rounded-xl bg-card"
      >
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Job Details</h2>
          <p className="text-sm text-muted-foreground">
            Fill in the job info below. Fields like `id` and timestamps will be
            handled by the backend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Engineer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Listing Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as JobListingStatus)}
            >
              <SelectTrigger id="status">
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
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select
              value={experienceLevel}
              onValueChange={(v) => setExperienceLevel(v as ExperienceLevel)}
            >
              <SelectTrigger id="experienceLevel">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid-level">Mid-level</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Job Type (optional)</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as JobListingType | "")}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Not specified</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Write the job description..."
            className="min-h-[140px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wage">Wage (optional)</Label>
            <Input
              id="wage"
              type="number"
              value={wage}
              onChange={(e) => setWage(e.target.value)}
              placeholder="e.g. 60000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wageInterval">Wage Interval</Label>
            <Select
              value={wageInterval}
              onValueChange={(v) => setWageInterval(v as WageInterval | "")}
            >
              <SelectTrigger id="wageInterval">
                <SelectValue placeholder="Select wage interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Not specified</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationRequirement">
              Location Requirement
            </Label>
            <Select
              value={locationRequirement}
              onValueChange={(v) =>
                setLocationRequirement(v as LocationRequirement)
              }
            >
              <SelectTrigger id="locationRequirement">
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
            <Label htmlFor="isFeatured">Featured</Label>
            <div className="flex items-center gap-3">
              <input
                id="isFeatured"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm text-muted-foreground">
                Highlight this job
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stateAbbreviation">State (optional)</Label>
            <Input
              id="stateAbbreviation"
              value={stateAbbreviation}
              onChange={(e) => setStateAbbreviation(e.target.value)}
              placeholder="e.g. CA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City (optional)</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. San Francisco"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/app/employer-dashboard"
            className="text-sm text-blue-500 bg-blue-500/10 px-3 py-2 rounded-md"
          >
            Back
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Job"}
          </Button>
        </div>
      </form>
    </div>
  );
}
