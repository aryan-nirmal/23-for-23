import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/types";

const SEVERITY_STYLES: Record<
  Severity,
  { bg: string; text: string; ring: string }
> = {
  critical: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    ring: "ring-red-500/30",
  },
  serious: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    ring: "ring-orange-500/30",
  },
  moderate: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    ring: "ring-yellow-500/30",
  },
  minor: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    ring: "ring-blue-500/30",
  },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const styles = SEVERITY_STYLES[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium uppercase tracking-wide ring-1",
        styles.bg,
        styles.text,
        styles.ring
      )}
    >
      {severity}
    </span>
  );
}