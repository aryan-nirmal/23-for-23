"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Moon,
  AlertTriangle,
  BookOpen,
  RefreshCw,
  FlaskConical,
  Lightbulb,
  Shield,
} from "lucide-react";
import { getPatternLabel } from "@/lib/classifier";
import { RESULTS_STORAGE_KEY } from "@/lib/quiz-data";
import { SafetyBanner } from "@/components/SafetyBanner";
import { cn } from "@/lib/utils";
import type { ClassificationResult, Recommendation } from "@/lib/types";

type StoredResults = {
  result: ClassificationResult;
  recommendations: Recommendation[];
  completedAt: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  behavioral: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  environmental: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  supplement: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  lifestyle: "bg-amber-500/10 text-amber-300 border-amber-500/20",
};

const CONFIDENCE_LABELS = {
  high: "High confidence",
  moderate: "Moderate confidence",
  low: "Low confidence — retake quiz or consult a provider",
};

export default function ResultsPage() {
  const [data, setData] = useState<StoredResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESULTS_STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw) as StoredResults);
      }
    } catch {
      setData(null);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Loading results…</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <Moon size={48} className="text-indigo-400" />
        <h1 className="text-2xl font-bold text-white">No results yet</h1>
        <p className="text-slate-400 text-center max-w-md">
          Complete the sleep quiz to get your personalized pattern classification
          and recommendations.
        </p>
        <Link
          href="/quiz"
          className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Take the Quiz
        </Link>
      </div>
    );
  }

  const { result, recommendations } = data;
  const isClinical = result.primaryPattern === "needs_clinical_review";
  const hasRedFlags = result.redFlags.length > 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 border",
              isClinical
                ? "bg-red-500/10 border-red-500/25 text-red-300"
                : "bg-indigo-500/10 border-indigo-500/25 text-indigo-300"
            )}
          >
            <Moon size={14} />
            {getPatternLabel(result.primaryPattern)}
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Your Sleep Profile</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">{result.summary}</p>
          <p className="text-slate-500 text-sm mt-2">
            {CONFIDENCE_LABELS[result.confidence]}
          </p>
        </div>

        {/* Red flags */}
        {hasRedFlags && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-red-300 font-semibold mb-4">
              <AlertTriangle size={18} />
              Safety warnings — please read
            </div>
            <ul className="space-y-3">
              {result.redFlags.map((flag) => (
                <li
                  key={flag}
                  className="flex items-start gap-3 text-red-200/90 text-sm"
                >
                  <Shield size={14} className="flex-shrink-0 mt-0.5 text-red-400" />
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Secondary patterns */}
        {result.secondaryPatterns.length > 0 && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-sm mb-2">Also detected:</p>
            <div className="flex flex-wrap gap-2">
              {result.secondaryPatterns.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-sm"
                >
                  {getPatternLabel(p)}
                </span>
              ))}
            </div>
          </div>
        )}

        <SafetyBanner />

        {/* Recommendations */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">
            Personalized Recommendations
          </h2>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={cn(
                  "sleep-card border rounded-2xl p-6",
                  rec.priority === "primary"
                    ? "bg-slate-900/60 border-indigo-500/30 glow-indigo"
                    : "bg-slate-900/40 border-slate-800"
                )}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {rec.priority === "primary" && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      Primary
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize",
                      CATEGORY_COLORS[rec.category]
                    )}
                  >
                    {rec.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {rec.title}
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  {rec.description}
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb
                      size={14}
                      className="text-indigo-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                        Rationale
                      </p>
                      <p className="text-slate-400 text-sm">{rec.rationale}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FlaskConical
                      size={14}
                      className="text-emerald-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                        Evidence
                      </p>
                      <p className="text-slate-400 text-sm">{rec.evidenceNote}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/diary"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <BookOpen size={18} />
            Start Sleep Diary
          </Link>
          <Link
            href="/quiz"
            className="flex-1 flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 text-slate-300 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <RefreshCw size={18} />
            Retake Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}