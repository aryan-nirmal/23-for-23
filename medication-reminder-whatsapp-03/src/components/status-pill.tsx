import type { ReminderStatus } from "@/lib/types";
import { cn, toTitleCase } from "@/lib/utils";

export function StatusPill({ status }: { status: ReminderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]",
        status === "taken" && "bg-emerald-100 text-emerald-800",
        status === "sent" && "bg-sky-100 text-sky-800",
        status === "scheduled" && "bg-stone-200 text-stone-700",
        status === "snoozed" && "bg-amber-100 text-amber-800",
        status === "missed" && "bg-rose-100 text-rose-800",
        status === "escalated" && "bg-red-100 text-red-800",
        status === "failed" && "bg-zinc-200 text-zinc-700",
      )}
    >
      {toTitleCase(status)}
    </span>
  );
}
