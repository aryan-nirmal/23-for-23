import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { SimulatorConsole } from "@/features/simulator/components/simulator-console";
import { requireSession } from "@/lib/auth";
import { getStore } from "@/lib/mock/store";
import { getPatientDetails } from "@/lib/services/patients";

export default async function SimulatorPage() {
  const session = await requireSession();
  const store = getStore();

  const pendingReplies = store.reminderEvents
    .filter((event) => ["sent", "snoozed"].includes(event.status))
    .map((event) => {
      const detail = getPatientDetails(session.accountId, event.patientId);
      const medication = store.medications.find((item) => item.id === event.medicationId);
      return {
        eventId: event.id,
        patientName: detail?.patient.name ?? event.patientId,
        medicationName: medication?.name ?? event.medicationId,
        status: event.status,
      };
    });

  return (
    <AppShell
      session={session}
      currentPath="/simulator"
      title="Mock WhatsApp simulator"
      subtitle="Run the internal jobs, inject replies, and validate reminder transitions without spending on a messaging provider."
    >
      <div className="section-grid">
        <SectionCard
          title="Control room"
          subtitle="Each button triggers the same route handlers you would wire to cron jobs or provider webhooks in production."
        >
          <SimulatorConsole pendingReplies={pendingReplies} />
        </SectionCard>

        <SectionCard
          title="How to use it"
          subtitle="The quickest happy-path test"
        >
          <ol className="space-y-3 text-sm leading-7 text-[var(--muted)]">
            <li>1. Add a patient and at least one medication schedule.</li>
            <li>2. Run the reminder job once the schedule time has passed for that patient’s timezone.</li>
            <li>3. Inject a YES or SNOOZE reply from the control room.</li>
            <li>4. Run escalation processing to convert overdue reminders into caregiver alerts.</li>
            <li>5. Generate weekly summaries to populate the adherence views and message logs.</li>
          </ol>
        </SectionCard>
      </div>
    </AppShell>
  );
}
