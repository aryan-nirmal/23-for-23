"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Bot,
  CalendarCheck,
  Check,
  Copy,
  Loader2,
  Send,
  Sparkles,
} from "lucide-react";
import { ConfidenceBar } from "@/components/confidence-bar";
import { StatusBadge } from "@/components/status-badge";
import { formatSlotRange } from "@/lib/utils";
import type { BookingEmail, TimeSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  email: BookingEmail;
  availableSlots: TimeSlot[];
}

export function EmailDetailClient({ email, availableSlots }: Props) {
  const [status, setStatus] = useState(email.status);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [proposalText, setProposalText] = useState(email.proposalText ?? "");
  const [confirmedSlot, setConfirmedSlot] = useState(email.confirmedSlot);
  const [loading, setLoading] = useState<"propose" | "confirm" | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  function toggleSlot(start: string) {
    setSelectedSlots((prev) =>
      prev.includes(start)
        ? prev.filter((s) => s !== start)
        : prev.length < 3
          ? [...prev, start]
          : prev
    );
  }

  async function handlePropose() {
    setLoading("propose");
    try {
      const res = await fetch("/api/propose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailId: email.id,
          slotStarts: selectedSlots.length > 0 ? selectedSlots : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProposalText(data.proposalText);
        setStatus("proposed");
        if (selectedSlots.length === 0 && data.slots) {
          setSelectedSlots(data.slots.map((s: { start: string }) => s.start));
        }
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleConfirm(slotStart: string) {
    setLoading("confirm");
    try {
      const res = await fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId: email.id, slotStart }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("confirmed");
        setConfirmedSlot(slotStart);
        setConfirmMessage(data.confirmationText);
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(proposalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const slotsToShow =
    selectedSlots.length > 0
      ? availableSlots.filter((s) => selectedSlots.includes(s.start))
      : availableSlots;

  return (
    <div className="grid flex-1 gap-6 overflow-auto p-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="mb-3 text-sm font-medium text-zinc-400">Email</h2>
          <div className="mb-4 space-y-1">
            <p className="text-sm text-zinc-500">
              From:{" "}
              <span className="text-zinc-300">
                {email.fromName} &lt;{email.from}&gt;
              </span>
            </p>
            <p className="text-sm text-zinc-500">
              Subject:{" "}
              <span className="text-zinc-200">{email.subject}</span>
            </p>
            <p className="text-sm text-zinc-500">
              Received:{" "}
              <span className="text-zinc-300">
                {format(new Date(email.receivedAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </p>
          </div>
          <pre className="whitespace-pre-wrap rounded-lg bg-zinc-950 p-4 font-sans text-sm leading-relaxed text-zinc-300">
            {email.body}
          </pre>
        </section>

        <section className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Bot className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-medium text-violet-300">
              AI-Detected Intent
            </h2>
            <StatusBadge status={status} />
          </div>

          <p className="mb-4 text-sm leading-relaxed text-zinc-300">
            {email.intent.summary}
          </p>

          <div className="mb-3">
            <p className="mb-1 text-xs text-zinc-500">Confidence</p>
            <ConfidenceBar confidence={email.intent.confidence} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-zinc-900/80 p-3">
              <p className="text-xs text-zinc-500">Duration</p>
              <p className="font-medium text-zinc-200">
                {email.intent.durationMinutes} minutes
              </p>
            </div>
            <div className="rounded-lg bg-zinc-900/80 p-3">
              <p className="text-xs text-zinc-500">Type</p>
              <p className="font-medium text-zinc-200">
                {email.intent.meetingType}
              </p>
            </div>
            <div className="col-span-2 rounded-lg bg-zinc-900/80 p-3">
              <p className="text-xs text-zinc-500">Preferred days</p>
              <p className="font-medium text-zinc-200">
                {email.intent.preferredDates.join(", ")}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-4">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-medium text-zinc-200">
                Available Time Slots
              </h2>
            </div>
            <span className="text-xs text-zinc-500">
              Select up to 3 · Mon–Fri 9–5
            </span>
          </div>

          <div className="space-y-2">
            {availableSlots.map((slot) => {
              const isSelected = selectedSlots.includes(slot.start);
              const isConfirmed = confirmedSlot === slot.start;
              return (
                <button
                  key={slot.start}
                  type="button"
                  disabled={status === "confirmed"}
                  onClick={() => toggleSlot(slot.start)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                    isConfirmed
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                      : isSelected
                        ? "border-violet-500/50 bg-violet-500/10 text-violet-200"
                        : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-600"
                  )}
                >
                  <span>{formatSlotRange(slot.start, slot.end)}</span>
                  {isConfirmed ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : isSelected ? (
                    <Check className="h-4 w-4 text-violet-400" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {status !== "confirmed" && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handlePropose}
                disabled={loading === "propose"}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
              >
                {loading === "propose" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Generate Proposal
              </button>

              {selectedSlots.length === 1 && (
                <button
                  type="button"
                  onClick={() => handleConfirm(selectedSlots[0])}
                  disabled={loading === "confirm"}
                  className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
                >
                  {loading === "confirm" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CalendarCheck className="h-4 w-4" />
                  )}
                  Confirm
                </button>
              )}
            </div>
          )}
        </section>

        {proposalText && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-200">
                Proposed Reply
              </h2>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-zinc-950 p-4 font-sans text-sm leading-relaxed text-zinc-300">
              {proposalText}
            </pre>

            {status === "proposed" && slotsToShow.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {slotsToShow.map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    onClick={() => handleConfirm(slot.start)}
                    disabled={loading === "confirm"}
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
                  >
                    {loading === "confirm" ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CalendarCheck className="h-3 w-3" />
                    )}
                    Confirm {format(new Date(slot.start), "EEE h:mm a")}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {confirmMessage && (
          <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <div className="flex items-start gap-3">
              <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <h2 className="mb-1 text-sm font-medium text-emerald-300">
                  Booking Confirmed
                </h2>
                <p className="text-sm text-emerald-200/80">{confirmMessage}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}