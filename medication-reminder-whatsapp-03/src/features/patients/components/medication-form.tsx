"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MedicationForm({ patientId }: { patientId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");

    const response = await fetch(`/api/patients/${patientId}/medications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name") || ""),
        doseText: String(formData.get("doseText") || ""),
        instructions: String(formData.get("instructions") || ""),
        reminderTime: String(formData.get("reminderTime") || ""),
        graceMinutes: Number(formData.get("graceMinutes") || 30),
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not create the medication schedule.");
      return;
    }

    router.refresh();
  }

  return (
    <form action={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Medication</span>
        <input name="name" required placeholder="Telmisartan" className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Dose</span>
        <input name="doseText" required placeholder="40 mg" className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Reminder time</span>
        <input name="reminderTime" type="time" required className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Grace window (minutes)</span>
        <input name="graceMinutes" type="number" min="5" max="120" defaultValue="30" className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3" />
      </label>
      <label className="block md:col-span-2">
        <span className="mb-2 block text-sm font-semibold">Instructions</span>
        <textarea
          name="instructions"
          rows={3}
          placeholder="After breakfast"
          className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3"
        />
      </label>
      <div className="md:col-span-2">
        <button type="submit" className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-bold text-[var(--background)]">
          Add medication
        </button>
        {error ? <p className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
      </div>
    </form>
  );
}
