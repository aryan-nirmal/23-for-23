import { cn, statusColor } from "@/lib/utils";
import { STATUS_LABELS, type MilestoneStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: MilestoneStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusColor(status)
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}