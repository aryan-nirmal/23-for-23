import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { requireSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/services/patients";

export default async function PatientsPage() {
  const session = await requireSession();
  const { patients } = getDashboardData(session.accountId);

  return (
    <AppShell
      session={session}
      currentPath="/patients"
      title="Patient roster"
      subtitle="Every patient record includes consent capture, timezone, preferred language, medication schedules, and event history."
    >
      <SectionCard
        title="Active patients"
        subtitle="This v1 models one operator account managing many patients, with clinic-ready account typing but no multi-staff workspace logic yet."
        actions={
          <Link href="/patients/new" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
            Add patient
          </Link>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          {patients.map((patient) => (
            <Link
              key={patient.id}
              href={`/patients/${patient.id}`}
              className="rounded-[28px] border border-[var(--foreground)]/10 bg-white/60 p-5 transition hover:translate-y-[-2px]"
            >
              <p className="display text-3xl leading-none">{patient.name}</p>
              <p className="mt-3 text-sm text-[var(--muted)]">{patient.phone}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                <span>{patient.timezone}</span>
                <span>{patient.preferredLanguage}</span>
                <span>{patient.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
