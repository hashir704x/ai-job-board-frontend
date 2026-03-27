import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type JobListingStatus = "draft" | "delisted" | "published";

const STATUS_OPTIONS: {
  value: JobListingStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "draft",
    label: "Draft",
    description:
      "Not visible publicly. Safe for edits before you go live.",
  },
  {
    value: "published",
    label: "Published",
    description: "Live listing; candidates can discover and apply.",
  },
  {
    value: "delisted",
    label: "Delisted",
    description: "Removed from the board but kept for your records.",
  },
];

type UpdateJobStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: JobListingStatus;
  onUpdate: (status: JobListingStatus) => Promise<void>;
};

export default function UpdateJobStatusDialog({
  open,
  onOpenChange,
  currentStatus,
  onUpdate,
}: UpdateJobStatusDialogProps) {
  const [selected, setSelected] = useState<JobListingStatus | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (open) setSelected(null);
  }, [open]);

  const canConfirm = Boolean(selected) && selected !== currentStatus;

  async function handleConfirm() {
    if (!selected || selected === currentStatus) return;
    setIsConfirming(true);
    try {
      await onUpdate(selected);
      onOpenChange(false);
    } catch (e) {
      alert(
        e instanceof Error
          ? e.message
          : "Failed to update listing status",
      );
    } finally {
      setIsConfirming(false);
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next && isConfirming) return;
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isConfirming}>
        <DialogHeader>
          <DialogTitle>Update listing status</DialogTitle>
          <DialogDescription>
            Choose how this job should appear, then confirm. Current status:{" "}
            <span className="font-medium text-foreground capitalize">
              {currentStatus}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto rounded-lg border bg-muted/30 p-2">
          {STATUS_OPTIONS.map((opt) => {
            const isCurrent = opt.value === currentStatus;
            const isSelected = opt.value === selected;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  disabled={isConfirming}
                  onClick={() => setSelected(opt.value)}
                  className={cn(
                    "flex w-full flex-col gap-0.5 rounded-md border px-3 py-2.5 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-transparent bg-background hover:bg-accent/80",
                  )}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="font-medium text-sm">{opt.label}</span>
                    {isCurrent && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        Current
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground leading-snug">
                    {opt.description}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isConfirming}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canConfirm || isConfirming}
            onClick={handleConfirm}
          >
            {isConfirming && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {isConfirming ? "Updating…" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
