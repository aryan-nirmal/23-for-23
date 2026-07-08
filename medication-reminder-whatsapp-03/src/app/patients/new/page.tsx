import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { PatientOnboardingForm } from "@/features/patients/components/patient-onboarding-form";
import { requireSession } from "@/lib/auth";

export default async function NewPatientPage() {
  const session = await requireSession();

  return (
    <AppShell
      session={session}
      currentPath="/patients/new"
      title="Onboard a patient"
      subtitle="Capture caregiver context, patient details, consent, timezone, and language before the first reminder cycle starts."
    >
      <SectionCard title="Registration" subtitle="This form maps directly to the MVP patient creation flow and stores immutable consent events alongside the patient record.">
        <PatientOnboardingForm />
      </SectionCard>
    </AppShell>
  );
}
