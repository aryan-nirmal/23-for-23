import { cn } from "@/lib/utils";
import type { ScanSummary } from "@/lib/types";

const CARDS = [
  { key: "critical" as const, label: "Critical", color: "text-red-400", border: "border-red-500/20" },
  { key: "serious" as const, label: "Serious", color: "text-orange-400", border: "border-orange-500/20" },
  { key: "moderate" as const, label: "Moderate", color: "text-yellow-400", border: "border-yellow-500/20" },
  { key: "minor" as const, label: "Minor", color: "text-blue-400", border: "border-blue-500/20" },
];

export function SummaryCards({ summary }: { summary: ScanSummary }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {CARDS.map(({ key, label, color, border }) => (
        <div
          key={key}
          className={cn(
            "rounded-xl border bg-zinc-900/50 p-4 text-center",
            border
          )}
        >
          <p className={cn("text-3xl font-bold tabular-nums", color)}>
            {summary[key]}
          </p>
          <p className="mt-1 text-sm text-zinc-500">{label}</p>
        </div>
      ))}
    </div>
  );
}