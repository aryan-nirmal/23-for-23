"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { createProject } from "@/app/actions";
import { cn } from "@/lib/utils";

type MilestoneRow = {
  title: string;
  amount: string;
  dueDate: string;
};

const emptyMilestone = (): MilestoneRow => ({
  title: "",
  amount: "",
  dueDate: "",
});

export function CreateProjectForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clientName, setClientName] = useState("");
  const [milestones, setMilestones] = useState<MilestoneRow[]>([
    emptyMilestone(),
    emptyMilestone(),
  ]);
  const [error, setError] = useState<string | null>(null);

  function updateMilestone(index: number, field: keyof MilestoneRow, value: string) {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  }

  function addMilestone() {
    setMilestones((prev) => [...prev, emptyMilestone()]);
  }

  function removeMilestone(index: number) {
    if (milestones.length <= 1) return;
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  }

  const totalAmount = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.amount) || 0),
    0
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("clientName", clientName);
    formData.set(
      "milestones",
      JSON.stringify(
        milestones.map((m) => ({
          title: m.title,
          amount: parseFloat(m.amount) || 0,
          dueDate: m.dueDate,
        }))
      )
    );

    startTransition(async () => {
      const result = await createProject(formData);
      if (result.success) {
        router.push(`/projects/${result.projectId}`);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-zinc-300">
          Client Name
        </label>
        <input
          id="clientName"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="e.g. Acme Corp"
          required
          className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-300">Milestones</h3>
          <button
            type="button"
            onClick={addMilestone}
            className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300"
          >
            <Plus className="h-4 w-4" />
            Add milestone
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Milestone {index + 1}
                </span>
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="text-zinc-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(index, "title", e.target.value)}
                    placeholder="Title"
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={milestone.amount}
                    onChange={(e) => updateMilestone(index, "amount", e.target.value)}
                    placeholder="Amount (₹)"
                    min="1"
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={milestone.dueDate}
                    onChange={(e) => updateMilestone(index, "dueDate", e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3">
        <span className="text-sm text-zinc-400">Total project value</span>
        <span className="text-lg font-semibold text-emerald-400">
          ₹{totalAmount.toLocaleString("en-IN")}
        </span>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50 sm:w-auto sm:px-8"
        )}
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Create Project
      </button>
    </form>
  );
}