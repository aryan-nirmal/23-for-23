"use client";

import { useState } from "react";
import { Check, Loader2, Mail, Save } from "lucide-react";
import type { AppSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  initialSettings: AppSettings;
}

export function SettingsForm({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleDay(day: number) {
    setSettings((prev) => {
      const days = prev.workingHours.days.includes(day)
        ? prev.workingHours.days.filter((d) => d !== day)
        : [...prev.workingHours.days, day].sort();
      return {
        ...prev,
        workingHours: { ...prev.workingHours, days },
      };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="mb-4 text-sm font-medium text-zinc-200">
          Gmail Connection
        </h2>

        <div className="flex items-center gap-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
            <Mail className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-emerald-300">Connected</p>
            <p className="text-sm text-emerald-400/70">{settings.gmailEmail}</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
            <Check className="h-3 w-3" />
            Active
          </span>
        </div>

        <p className="mt-3 text-xs text-zinc-500">
          Autobook AI is monitoring this inbox for booking requests. Disconnect
          is disabled in this demo.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="mb-4 text-sm font-medium text-zinc-200">
          Working Hours
        </h2>

        <div className="mb-5 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">
              Start hour
            </label>
            <select
              value={settings.workingHours.startHour}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  workingHours: {
                    ...prev.workingHours,
                    startHour: Number(e.target.value),
                  },
                }))
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-violet-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 6).map((h) => (
                <option key={h} value={h}>
                  {h > 12 ? `${h - 12} PM` : h === 12 ? "12 PM" : `${h} AM`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">
              End hour
            </label>
            <select
              value={settings.workingHours.endHour}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  workingHours: {
                    ...prev.workingHours,
                    endHour: Number(e.target.value),
                  },
                }))
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-violet-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 12).map((h) => (
                <option key={h} value={h}>
                  {h > 12 ? `${h - 12} PM` : `${h} PM`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs text-zinc-500">
            Available days
          </label>
          <div className="flex gap-2">
            {DAY_LABELS.map((label, i) => {
              const active = settings.workingHours.days.includes(i);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                    active
                      ? "border-violet-500/50 bg-violet-500/20 text-violet-300"
                      : "border-zinc-700 bg-zinc-950 text-zinc-500 hover:border-zinc-600"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : saved ? (
          <Check className="h-4 w-4" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saved ? "Settings saved" : "Save settings"}
      </button>
    </div>
  );
}