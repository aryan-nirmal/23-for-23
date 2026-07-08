import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { requireSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/services/patients";
import { friendlyDate, percent } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await requireSession();
  const dashboard = getDashboardData(session.accountId);

  return (
    <AppShell
      session={session}
      currentPath="/dashboard"
      title="Operations dashboard"
      subtitle="Monitor due doses, reply behavior, escalation pressure, and message activity from one caregiver-first command view."
    >
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Active patients" value={dashboard.metrics.activePatients} />
        <MetricCard label="Taken today" value={dashboard.metrics.totalTaken} accent="var(--accent-2)" />
        <MetricCard label="Missed or escalated" value={dashboard.metrics.totalMissed} accent="var(--danger)" />
        <MetricCard label="Adherence rate" value={percent(dashboard.metrics.adherenceRate, 100)} />
      </section>

      <div className="section-grid">
        <SectionCard
          title="Today’s reminder activity"
          subtitle="The event timeline below is the same core record used by the reminder engine, the simulator, and weekly summary generation."
          actions={
            <Link href="/simulator" className="rounded-full border border-[var(--foreground)]/12 px-4 py-2 text-sm font-semibold">
              Open simulator
            </Link>
          }
        >
          <div className="space-y-4">
            {dashboard.todayEvents.length ? (
              dashboard.todayEvents.slice(0, 8).map((event) => (
                <div
                  key={event.id}
                  className="grid gap-3 rounded-[24px] border border-[var(--foreground)]/10 bg-white/60 p-4 md:grid-cols-[1.2fr_0.8fr_auto]"
                >
                  <div>
                    <p className="font-semibold">{event.medicationId}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Due {friendlyDate(event.dueAt)} • local key {event.localDateKey}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    Reply: {event.replyText ?? "Waiting for patient confirmation"}
                  </p>
                  <StatusPill status={event.status} />
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-[var(--muted)]">No events yet. Run the reminder job in the simulator to seed today’s dose flow.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Recent message log" subtitle="Immutable outbound and inbound entries useful for support, audits, and provider debugging later.">
          <div className="space-y-4">
            {dashboard.messageLogs.map((log) => (
              <div key={log.id} className="rounded-[24px] border border-[var(--foreground)]/10 bg-white/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold">
                    {log.kind} • {log.direction}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{log.deliveryStatus}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{log.content}</p>
                <p className="mt-3 text-xs text-[var(--muted)]">{friendlyDate(log.createdAt)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
