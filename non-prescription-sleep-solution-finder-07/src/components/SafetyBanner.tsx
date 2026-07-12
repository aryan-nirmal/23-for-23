import { AlertTriangle } from "lucide-react";
import { SAFETY_DISCLAIMER } from "@/lib/recommendations";

export function SafetyBanner() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 flex gap-3">
      <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="text-amber-200/80 text-sm leading-relaxed">{SAFETY_DISCLAIMER}</p>
    </div>
  );
}