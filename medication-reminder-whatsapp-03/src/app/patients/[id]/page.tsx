import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { MedicationForm } from "@/features/patients/components/medication-form";
import { requireSession } from "@/lib/auth";
import { getPatientDetails } from "@/lib/services/patients";
import { friendlyDate, slugTimeLabel } from "@/lib/utils";

export default async function PatientDetailPage({
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

  return (
    <AppShell
      session={session}
      currentPath="/patients"
      title={detail.patient.name}
      subtitle={`${detail.patient.phone} • ${detail.patient.timezone} • ${detail.patient.preferredLanguage}`}
    >
      <div className="section-grid">
        <SectionCard
          title="Medication plan"
          subtitle="Multiple medications per patient are supported, each with its own daily schedule and escalation window."
          actions={
            <Link href={`/patients/${detail.patient.id}/summary`} className="rounded-full border border-[var(--foreground)]/12 px-4 py-2 text-sm font-semibold">
              View adherence summary
            </Link>
          }
        >
          <div className="space-y-4">
            {detail.medications.map((medication) => {
              const schedule = detail.schedules.find((item) => item.medicationId === medication.id);
              return (
                <div key={medication.id} className="rounded-[24px] border border-[var(--foreground)]/10 bg-white/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {medication.name} • {medication.doseText}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{medication.instructions || "No extra instructions"}</p>
                    </div>
                    {schedule ? (
                      <div className="text-sm text-[var(--muted)]">
                        {slugTimeLabel(schedule.reminderTime)} • {schedule.graceMinutes} min grace
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Add medication" subtitle="New medications immediately become eligible for the reminder processing job.">
          <MedicationForm patientId={detail.patient.id} />
        </SectionCard>
      </div>

      <div className="section-grid">
        <SectionCard title="Reminder timeline" subtitle="This is the operational source of truth for dose progression.">
          <div className="space-y-4">
            {detail.events.map((event) => (
              <div key={event.id} className="rounded-[24px] border border-[var(--foreground)]/10 bg-white/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold">{event.medicationId}</p>
                  <StatusPill status={event.status} />
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Due {friendlyDate(event.dueAt)} • reply {event.replyText ?? "pending"}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Audit + consent" subtitle="Message payload history and immutable consent capture stay attached to the patient record.">
          <div className="space-y-4">
            {detail.consents.map((consent) => (
              <div key={consent.id} className="rounded-[24px] border border-[var(--foreground)]/10 bg-white/60 p-4">
                <p className="font-semibold">{consent.type}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{consent.note}</p>
              </div>
            ))}
            {detail.logs.slice(0, 6).map((log) => (
              <div key={log.id} className="rounded-[24px] border border-[var(--foreground)]/10 bg-white/60 p-4">
                <p className="font-semibold">
                  {log.kind} • {log.direction}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{log.content}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
