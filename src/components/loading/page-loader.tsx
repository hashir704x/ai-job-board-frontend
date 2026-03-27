import PageShell from "@/components/page-shell";

export default function PageLoader({
  title,
  message = "Loading...",
  size = "md",
}: {
  title: string;
  message?: string;
  size?: "md" | "lg";
}) {
  return (
    <PageShell size={size} title={title} description={message}>
      <div className="border rounded-xl p-6 bg-card">
        <div className="flex items-center justify-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" />
          <div className="text-sm text-muted-foreground">{message}</div>
        </div>
      </div>
    </PageShell>
  );
}

