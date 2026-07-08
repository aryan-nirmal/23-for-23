import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { SectionCard } from "@/components/section-card";
import { requireSession } from "@/lib/auth";
import { getPatientAdherence, getPatientDetails } from "@/lib/services/patients";
import { friendlyDate } from "@/lib/utils";

export default async function PatientSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();
  const detail = getPatientDetails(session.accountId, id);

  if (!detail) {
    notFound();
  }

  const adherence = getPatientAdherence(id);

  return (
    <AppShell
      session={session}
      currentPath="/patients"
      title={`${detail.patient.name} summary`}
      subtitle="Weekly-style adherence rollup built from reminder events and delayed-response flags."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Taken" value={adherence.takenCount} />
        <MetricCard label="Missed" value={adherence.missedCount} accent="var(--danger)" />
        <MetricCard label="Delayed" value={adherence.delayedCount} accent="var(--accent-2)" />
      </section>

      <SectionCard
        title="Included events"
        subtitle={`Window ${friendlyDate(adherence.from)} to ${friendlyDate(adherence.to)}`}
      >
        <div className="space-y-4">
          {adherence.events.map((event) => (
            <div key={event.id} className="rounded-[24px] border border-[var(--foreground)]/10 bg-white/60 p-4">
              <p className="font-semibold">{event.medicationId}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Status {event.status} • due {friendlyDate(event.dueAt)} • delayed {event.wasDelayed ? "yes" : "no"}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
