"use client";

import { useTransition, useState } from "react";
import {
  Wallet,
  Play,
  Upload,
  CheckCircle,
  Banknote,
  Loader2,
  CreditCard,
} from "lucide-react";
import type { Milestone } from "@/lib/types";
import {
  fundMilestone,
  startMilestone,
  submitMilestone,
  approveMilestone,
  releaseMilestone,
} from "@/app/actions";
import { cn } from "@/lib/utils";

interface MilestoneActionsProps {
  projectId: string;
  milestone: Milestone;
}

type ActionConfig = {
  label: string;
  icon: React.ElementType;
  variant: "primary" | "secondary";
  handler: () => Promise<{ success: boolean; paymentId?: string; error?: string }>;
  razorpay?: boolean;
};

export function MilestoneActions({ projectId, milestone }: MilestoneActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const actions: Record<string, ActionConfig | null> = {
    draft: {
      label: "Fund Milestone",
      icon: Wallet,
      variant: "primary",
      razorpay: true,
      handler: () => fundMilestone(projectId, milestone.id),
    },
    funded: {
      label: "Start Work",
      icon: Play,
      variant: "secondary",
      handler: () => startMilestone(projectId, milestone.id),
    },
    in_progress: {
      label: "Submit Work",
      icon: Upload,
      variant: "primary",
      handler: () => submitMilestone(projectId, milestone.id),
    },
    submitted: {
      label: "Approve Work",
      icon: CheckCircle,
      variant: "primary",
      handler: () => approveMilestone(projectId, milestone.id),
    },
    approved: {
      label: "Release Payment",
      icon: Banknote,
      variant: "primary",
      razorpay: true,
      handler: () => releaseMilestone(projectId, milestone.id),
    },
    released: null,
  };

  const action = actions[milestone.status];

  function handleAction(config: ActionConfig) {
    setMessage(null);
    setActiveAction(config.label);
    startTransition(async () => {
      const result = await config.handler();
      if (result.success) {
        const text = result.paymentId
          ? `Payment successful · ${result.paymentId}`
          : `${config.label} completed`;
        setMessage({ type: "success", text });
      } else {
        setMessage({ type: "error", text: result.error ?? "Action failed" });
      }
      setActiveAction(null);
    });
  }

  if (!action) {
    return (
      <p className="text-sm text-emerald-400/80">
        Payment released — milestone complete
      </p>
    );
  }

  const Icon = action.icon;

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleAction(action)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50",
          action.variant === "primary"
            ? "bg-emerald-600 text-white hover:bg-emerald-500"
            : "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
        )}
      >
        {isPending && activeAction === action.label ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : action.razorpay ? (
          <CreditCard className="h-4 w-4" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
        {action.razorpay ? `Pay via Razorpay — ${action.label}` : action.label}
      </button>

      {action.razorpay && (
        <p className="text-xs text-zinc-500">
          Mock Razorpay checkout — funds held in escrow until release
        </p>
      )}

      {message && (
        <p
          className={cn(
            "text-sm",
            message.type === "success" ? "text-emerald-400" : "text-red-400"
          )}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}