import { cn } from "@/lib/utils";

type BadgeVariant =
  | "active"
  | "completed"
  | "on_hold"
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "todo"
  | "in_progress"
  | "done";

const variants: Record<BadgeVariant, string> = {
  active: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  completed: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/30",
  on_hold: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  draft: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/30",
  sent: "bg-blue-500/15 text-blue-400 ring-blue-500/30",
  paid: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  overdue: "bg-red-500/15 text-red-400 ring-red-500/30",
  todo: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/30",
  in_progress: "bg-violet-500/15 text-violet-400 ring-violet-500/30",
  done: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
};

const labels: Record<BadgeVariant, string> = {
  active: "Active",
  completed: "Completed",
  on_hold: "On Hold",
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

interface StatusBadgeProps {
  status: BadgeVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variants[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}