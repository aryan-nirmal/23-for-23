import {
  ShieldCheck,
  Star,
  Truck,
  IndianRupee,
  type LucideIcon,
} from "lucide-react";
import type { TrustScore } from "@/lib/types";
import { getTrustLabel } from "@/lib/trust-score";
import { cn } from "@/lib/utils";

interface TrustScoreCardProps {
  score: TrustScore;
}

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          pct >= 75
            ? "bg-emerald-500"
            : pct >= 50
              ? "bg-amber-500"
              : "bg-red-500"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ComponentRow({
  icon: Icon,
  label,
  value,
  display,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  display: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Icon className="h-4 w-4" />
          {label}
        </div>
        <span className="text-sm font-medium text-zinc-200">{display}</span>
      </div>
      <ScoreBar value={value} />
    </div>
  );
}

export default function TrustScoreCard({ score }: TrustScoreCardProps) {
  const { label, color } = getTrustLabel(score.overall);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">Trust Score</h2>
        <span className={cn("text-sm font-medium", color)}>{label}</span>
      </div>

      <div className="mb-8 flex items-center justify-center">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-zinc-800"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(score.overall / 100) * 327} 327`}
              strokeLinecap="round"
              className={
                score.overall >= 75
                  ? "text-emerald-500"
                  : score.overall >= 50
                    ? "text-amber-500"
                    : "text-red-500"
              }
            />
          </svg>
          <div className="text-center">
            <span className="text-4xl font-bold text-zinc-100">
              {score.overall}
            </span>
            <span className="block text-xs text-zinc-500">/ 100</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ComponentRow
          icon={ShieldCheck}
          label="Registration Verified"
          value={score.registrationVerified ? 100 : 20}
          display={score.registrationVerified ? "Verified" : "Not Verified"}
        />
        <ComponentRow
          icon={Star}
          label="Peer Rating"
          value={score.peerRating > 0 ? (score.peerRating / 5) * 100 : 50}
          display={
            score.peerRating > 0
              ? `${score.peerRating} / 5`
              : "No reviews yet"
          }
        />
        <ComponentRow
          icon={Truck}
          label="Delivery Score"
          value={score.deliveryScore}
          display={`${score.deliveryScore}%`}
        />
        <ComponentRow
          icon={IndianRupee}
          label="Payment Reliability"
          value={score.paymentReliability}
          display={`${score.paymentReliability}%`}
        />
      </div>
    </div>
  );
}