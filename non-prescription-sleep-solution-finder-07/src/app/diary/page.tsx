"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, TrendingUp, Star } from "lucide-react";
import {
  loadDiaryEntries,
  addDiaryEntry,
  deleteDiaryEntry,
} from "@/lib/diary";
import { formatDate, cn } from "@/lib/utils";
import type { DiaryEntry } from "@/lib/types";

const QUALITY_LABELS = ["", "Poor", "Fair", "Okay", "Good", "Great"];

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [hoursSlept, setHoursSlept] = useState(7);
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEntries(loadDiaryEntries());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry = addDiaryEntry({ date, hoursSlept, quality, notes });
    setEntries((prev) => {
      const filtered = prev.filter((e) => e.date !== date);
      return [entry, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });
    setNotes("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDelete(id: string) {
    deleteDiaryEntry(id);
    setEntries(loadDiaryEntries());
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Sleep Diary</h1>
            <p className="text-slate-400 text-sm">
              Log your sleep for 2 weeks to spot patterns and track improvement.
            </p>
          </div>
          <Link
            href="/progress"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            <TrendingUp size={16} />
            View Progress
          </Link>
        </div>

        {/* Entry form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Plus size={18} className="text-indigo-400" />
            Log Tonight&apos;s Sleep
          </h2>

          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Hours slept: <span className="text-white">{hoursSlept}h</span>
              </label>
              <input
                type="range"
                min={0}
                max={12}
                step={0.5}
                value={hoursSlept}
                onChange={(e) => setHoursSlept(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0h</span>
                <span>12h</span>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm text-slate-400 mb-2">
              Sleep quality:{" "}
              <span className="text-white">
                {quality}/5 — {QUALITY_LABELS[quality]}
              </span>
            </label>
            <div className="flex gap-2">
              {([1, 2, 3, 4, 5] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuality(q)}
                  className={cn(
                    "flex-1 py-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1",
                    quality === q
                      ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                      : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600"
                  )}
                >
                  <Star
                    size={16}
                    className={quality >= q ? "text-indigo-400 fill-indigo-400" : ""}
                  />
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm text-slate-400 mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What helped or hurt your sleep tonight?"
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {saved ? "Saved!" : "Save Entry"}
          </button>
        </form>

        {/* Entries list */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Entries ({entries.length})
          </h2>
          {entries.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p>No entries yet. Log your first night above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="sleep-card bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-semibold text-white">
                        {formatDate(entry.date)}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {entry.hoursSlept}h slept
                      </span>
                      <span className="flex items-center gap-1 text-indigo-300 text-sm">
                        {Array.from({ length: entry.quality }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className="fill-indigo-400 text-indigo-400"
                          />
                        ))}
                        <span className="text-slate-500 ml-1">
                          {QUALITY_LABELS[entry.quality]}
                        </span>
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-slate-400 text-sm">{entry.notes}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="text-slate-600 hover:text-red-400 transition-colors p-1"
                    aria-label="Delete entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}