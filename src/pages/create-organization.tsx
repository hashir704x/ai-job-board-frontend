import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function CreateOrganization() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, ""),
    );
  };

  const handleCreate = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!name || !slug) {
      alert("Please fill in all fields");
      return;
    }

    await authClient.organization.create(
      {
        name,
        slug,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          navigate("/app/employer-dashboard");
          setIsLoading(false);
        },
        onError: (ctx) => {
          console.log(ctx.error.message);
          alert(ctx.error.message);
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <form
        onSubmit={handleCreate}
        className="max-w-sm w-full space-y-6 border p-8 rounded-xl bg-card transition-colors duration-300"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Register Organization</h1>
          <p className="text-sm text-muted-foreground">
            Create your organization to start posting jobs.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              placeholder="e.g. Netsol"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Organization Slug</Label>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Input
                id="slug"
                className="h-8"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="e.g. netsol"
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? "Creating..." : "Create Organization"}
        </Button>
      </form>
    </div>
  );
}
