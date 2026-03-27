export default function FullscreenLoader({
  title = "Loading...",
  subtitle = "Please wait",
  show = true,
}: {
  title?: string;
  subtitle?: string;
  show?: boolean;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card px-6 py-5 shadow-sm">
        <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" />
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  );
}

