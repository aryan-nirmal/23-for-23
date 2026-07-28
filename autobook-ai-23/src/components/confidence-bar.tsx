import { cn } from "@/lib/utils";

export function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            pct >= 90 ? "bg-emerald-500" : pct >= 80 ? "bg-amber-500" : "bg-red-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-zinc-400">{pct}%</span>
    </div>
  );
}