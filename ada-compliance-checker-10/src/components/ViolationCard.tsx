import { AlertTriangle, Code, Wrench } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";
import type { Violation } from "@/lib/types";

export function ViolationCard({ violation }: { violation: Violation }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
            <AlertTriangle className="h-4 w-4 text-zinc-400" />
          </div>
          <div>
            <h4 className="font-medium text-zinc-100">{violation.title}</h4>
            <p className="mt-1 text-sm text-zinc-500">{violation.description}</p>
          </div>
        </div>
        <SeverityBadge severity={violation.severity} />
      </div>

      <div className="ml-11 space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Code className="h-3.5 w-3.5 shrink-0" />
          <code className="font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
            {violation.selector}
          </code>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <Wrench className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" />
          <p className="text-zinc-400">
            <span className="text-emerald-500 font-medium">Fix: </span>
            {violation.fix}
          </p>
        </div>
        <p className="text-xs text-zinc-600">{violation.wcagCriteria}</p>
      </div>
    </div>
  );
}