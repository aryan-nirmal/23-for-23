import { cn } from "@/lib/utils";
import type { EmailStatus } from "@/lib/types";

const styles: Record<EmailStatus, string> = {
  new: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  proposed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const labels: Record<EmailStatus, string> = {
  new: "New",
  proposed: "Proposed",
  confirmed: "Confirmed",
};

export function StatusBadge({ status }: { status: EmailStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}