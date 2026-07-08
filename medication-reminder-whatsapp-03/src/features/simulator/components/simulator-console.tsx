"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SimulatorConsole({
  pendingReplies,
}: {
  pendingReplies: Array<{ eventId: string; patientName: string; medicationName: string; status: string }>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function trigger(path: string, body?: Record<string, unknown>) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = (await response.json()) as { message?: string; error?: string };
    setMessage(data.message ?? data.error ?? "Action completed.");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <button onClick={() => trigger("/api/internal/jobs/process-reminders")} className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white">
          Process reminders
        </button>
        <button onClick={() => trigger("/api/internal/jobs/process-escalations")} className="rounded-full bg-[var(--danger)] px-5 py-3 text-sm font-bold text-white">
          Process escalations
        </button>
        <button onClick={() => trigger("/api/internal/jobs/generate-weekly-summaries")} className="rounded-full border border-[var(--foreground)]/12 px-5 py-3 text-sm font-bold">
          Generate weekly summaries
        </button>
      </div>

      <div className="rounded-[28px] border border-[var(--foreground)]/10 bg-white/60 p-5">
        <p className="text-sm font-semibold">Inject replies</p>
        <div className="mt-4 space-y-4">
          {pendingReplies.length ? (
            pendingReplies.map((item) => (
              <div key={item.eventId} className="rounded-[24px] border border-[var(--foreground)]/10 p-4">
                <p className="font-semibold">
                  {item.patientName} • {item.medicationName}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">Current status: {item.status}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      trigger("/api/webhooks/mock-whatsapp", { eventId: item.eventId, replyText: "YES" })
                    }
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Reply YES
                  </button>
                  <button
                    onClick={() =>
                      trigger("/api/webhooks/mock-whatsapp", { eventId: item.eventId, replyText: "SNOOZE" })
                    }
                    className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Reply SNOOZE
                  </button>
                  <button
                    onClick={() =>
                      trigger("/api/webhooks/mock-whatsapp", { eventId: item.eventId, replyText: "DONE" })
                    }
                    className="rounded-full border border-[var(--foreground)]/12 px-4 py-2 text-sm font-semibold"
                  >
                    Reply DONE
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm leading-6 text-[var(--muted)]">
              No active reminder is waiting for a reply. Trigger the reminder job first.
            </p>
          )}
        </div>
      </div>

      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
