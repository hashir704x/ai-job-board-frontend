import type { ReactNode } from "react";

export default function PageShell({
  title,
  description,
  actions,
  children,
  size = "lg",
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  const maxWidth = size === "md" ? "max-w-3xl" : "max-w-4xl";

  return (
    <div className="p-4">
      <div className={`mx-auto ${maxWidth} space-y-4`}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>

        {children}
      </div>
    </div>
  );
}

