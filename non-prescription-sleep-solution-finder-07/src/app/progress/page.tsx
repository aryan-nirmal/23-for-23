"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Moon,
  Clock,
  Star,
  BookOpen,
} from "lucide-react";
import { loadDiaryEntries, getDiaryStats, getLast14Days } from "@/lib/diary";
import { formatDate, formatHours } from "@/lib/utils";
import type { DiaryEntry } from "@/lib/types";

function MiniBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    setEntries(loadDiaryEntries());
  }, []);

  const stats = getDiaryStats(entries);
  const last14 = getLast14Days(entries);
  const hasData = entries.length > 0;

  const TrendIcon =
    stats.trend === "improving"
      ? TrendingUp
      : stats.trend === "declining"
        ? TrendingDown
        : Minus;

  const trendColor =
    stats.trend === "improving"
      ? "text-emerald-400"
      : stats.trend === "declining"
        ? "text-red-400"
        : "text-slate-400";

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Sleep Progress</h1>
          <p className="text-slate-400 text-sm">
            Trends from your 2-week sleep diary.
          </p>
        </div>

        {!hasData ? (
          <div className="text-center py-20">
            <Moon size={48} className="text-indigo-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              No diary data yet
            </h2>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
              Log at least one night in your sleep diary to see trends here.
            </p>
            <Link
              href="/diary"
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <BookOpen size={18} />
              Open Sleep Diary
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Clock,
                  label: "Avg hours",
                  value: formatHours(stats.avgHours),
                  color: "text-indigo-400",
                },
                {
                  icon: Star,
                  label: "Avg quality",
                  value: `${stats.avgQuality.toFixed(1)}/5`,
                  color: "text-amber-400",
                },
                {
                  icon: BookOpen,
                  label: "Entries logged",
                  value: String(stats.totalEntries),
                  color: "text-emerald-400",
                },
                {
                  icon: TrendIcon,
                  label: "Trend",
                  value:
                    stats.trend.charAt(0).toUpperCase() + stats.trend.slice(1),
                  color: trendColor,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-5"
                >
                  <s.icon size={18} className={`${s.color} mb-3`} />
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-slate-400 text-sm">{s.label}</p>
                </div>
              ))}
            </div>

            {/* 14-day chart */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">
                Last 14 Days
              </h2>

              <div className="space-y-3 mb-8">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hours slept
                </p>
                {last14.map((day) => (
                  <div key={`h-${day.date}`} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-16 flex-shrink-0">
                      {formatDate(day.date).split(",")[0]}
                    </span>
                    <MiniBar value={day.hoursSlept} max={10} color="bg-indigo-500" />
                    <span className="text-xs text-slate-400 w-8 text-right">
                      {day.hoursSlept > 0 ? `${day.hoursSlept}h` : "—"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Sleep quality (1–5)
                </p>
                {last14.map((day) => (
                  <div key={`q-${day.date}`} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-16 flex-shrink-0">
                      {formatDate(day.date).split(",")[0]}
                    </span>
                    <MiniBar value={day.quality} max={5} color="bg-amber-400" />
                    <span className="text-xs text-slate-400 w-8 text-right">
                      {day.quality > 0 ? day.quality : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best / worst */}
            {(stats.bestNight || stats.worstNight) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {stats.bestNight && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                    <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      Best night
                    </p>
                    <p className="text-white font-semibold">
                      {formatDate(stats.bestNight.date)}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {stats.bestNight.hoursSlept}h · Quality{" "}
                      {stats.bestNight.quality}/5
                    </p>
                  </div>
                )}
                {stats.worstNight && stats.worstNight.id !== stats.bestNight?.id && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                    <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      Toughest night
                    </p>
                    <p className="text-white font-semibold">
                      {formatDate(stats.worstNight.date)}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {stats.worstNight.hoursSlept}h · Quality{" "}
                      {stats.worstNight.quality}/5
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="text-center pt-4">
              <Link
                href="/diary"
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                ← Back to diary
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}