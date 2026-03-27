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

export type SwitchOrganizationItem = {
  id: string;
  name: string;
};

type SwitchOrganizationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizations: SwitchOrganizationItem[];
  activeOrganizationId: string | null | undefined;
  onSwitch: (organizationId: string) => Promise<void>;
};

export default function SwitchOrganizationDialog({
  open,
  onOpenChange,
  organizations,
  activeOrganizationId,
  onSwitch,
}: SwitchOrganizationDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (open) setSelectedId(null);
  }, [open]);

  const canConfirm =
    Boolean(selectedId) && selectedId !== activeOrganizationId;

  async function handleConfirm() {
    if (!selectedId || selectedId === activeOrganizationId) return;
    setIsConfirming(true);
    try {
      await onSwitch(selectedId);
      onOpenChange(false);
    } catch (e) {
      alert(
        e instanceof Error
          ? e.message
          : "Failed to switch organization",
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
          <DialogTitle>Switch organization</DialogTitle>
          <DialogDescription>
            Choose the organization you want to work in, then confirm.
          </DialogDescription>
        </DialogHeader>

        <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto rounded-lg border bg-muted/30 p-2">
          {organizations.map((org) => {
            const isActive = org.id === activeOrganizationId;
            const isSelected = org.id === selectedId;
            return (
              <li key={org.id}>
                <button
                  type="button"
                  disabled={isConfirming}
                  onClick={() => setSelectedId(org.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-transparent bg-background hover:bg-accent/80",
                  )}
                >
                  <span className="font-medium">{org.name}</span>
                  {isActive && (
                    <span className="text-xs text-muted-foreground">
                      Current
                    </span>
                  )}
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
            {isConfirming ? "Switching…" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
