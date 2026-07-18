import { Check } from "lucide-react";
import { MILESTONE_STATUSES, STATUS_LABELS, type MilestoneStatus } from "@/lib/types";
import { cn, statusIndex } from "@/lib/utils";

export function MilestonePipeline({ status }: { status: MilestoneStatus }) {
  const currentIndex = statusIndex(status);

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {MILESTONE_STATUSES.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center min-w-[72px]">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition",
                  isComplete && "border-emerald-500/50 bg-emerald-500/20 text-emerald-400",
                  isCurrent && "border-emerald-400 bg-emerald-500/30 text-emerald-300 ring-2 ring-emerald-500/20",
                  isUpcoming && "border-zinc-700 bg-zinc-800/50 text-zinc-500"
                )}
              >
                {isComplete ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-[10px] font-medium whitespace-nowrap",
                  isCurrent ? "text-emerald-400" : isComplete ? "text-zinc-400" : "text-zinc-600"
                )}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
            {index < MILESTONE_STATUSES.length - 1 && (
              <div
                className={cn(
                  "mx-0.5 mb-5 h-px w-6 shrink-0",
                  index < currentIndex ? "bg-emerald-500/40" : "bg-zinc-800"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}