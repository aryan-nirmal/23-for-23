"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PatientOnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caregiverName: String(formData.get("caregiverName") || ""),
        caregiverPhone: String(formData.get("caregiverPhone") || ""),
        patientName: String(formData.get("patientName") || ""),
        patientPhone: String(formData.get("patientPhone") || ""),
        timezone: String(formData.get("timezone") || "Asia/Kolkata"),
        preferredLanguage: String(formData.get("preferredLanguage") || "English"),
        patientConsent: formData.get("patientConsent") === "on",
        caregiverConsent: formData.get("caregiverConsent") === "on",
      }),
    });

    const data = (await response.json()) as { patient?: { id: string }; error?: string };

    if (!response.ok || !data.patient) {
      setError(data.error ?? "Could not create the patient profile.");
      setIsSubmitting(false);
      return;
    }

    router.push(`/patients/${data.patient.id}`);
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Caregiver name</span>
        <input
          name="caregiverName"
          required
          defaultValue="Rahul Sharma"
          className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Caregiver phone</span>
        <input
          name="caregiverPhone"
          required
          defaultValue="+91 98765 43210"
          className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Patient name</span>
        <input
          name="patientName"
          required
          placeholder="Meena Sharma"
          className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Patient phone</span>
        <input
          name="patientPhone"
          required
          placeholder="+91 ..."
          className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Timezone</span>
        <select
          name="timezone"
          defaultValue="Asia/Kolkata"
          className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3"
        >
          <option value="Asia/Kolkata">Asia/Kolkata</option>
          <option value="Asia/Dubai">Asia/Dubai</option>
          <option value="Europe/London">Europe/London</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Preferred language</span>
        <select
          name="preferredLanguage"
          defaultValue="English"
          className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3"
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Marathi">Marathi</option>
        </select>
      </label>

      <label className="flex items-start gap-3 rounded-2xl border border-[var(--foreground)]/10 bg-white/60 p-4 md:col-span-2">
        <input name="patientConsent" type="checkbox" defaultChecked className="mt-1" />
        <span className="text-sm leading-6 text-[var(--muted)]">
          Patient has opted in to WhatsApp reminders and understands this is a reminder tool, not a
          medical device.
        </span>
      </label>
      <label className="flex items-start gap-3 rounded-2xl border border-[var(--foreground)]/10 bg-white/60 p-4 md:col-span-2">
        <input name="caregiverConsent" type="checkbox" defaultChecked className="mt-1" />
        <span className="text-sm leading-6 text-[var(--muted)]">
          Caregiver agrees to receive escalation alerts and weekly summaries.
        </span>
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white"
        >
          {isSubmitting ? "Creating patient..." : "Create patient profile"}
        </button>
        {error ? <p className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
      </div>
    </form>
  );
}
