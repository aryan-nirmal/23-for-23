"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Header } from "@/components/Header";
import { SummaryCards } from "@/components/SummaryCards";
import { ViolationCard } from "@/components/ViolationCard";
import { exportScanToPdf } from "@/lib/pdf-export";
import type { ScanResult } from "@/lib/types";

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function fetchScan() {
      try {
        const res = await fetch(`/api/scan/${id}`);
        if (!res.ok) {
          setError("Scan not found. It may have expired or the ID is invalid.");
          return;
        }
        const data = await res.json();
        setScan(data);
      } catch {
        setError("Failed to load scan results.");
      } finally {
        setLoading(false);
      }
    }
    fetchScan();
  }, [id]);

  function handleExport() {
    if (!scan) return;
    setExporting(true);
    try {
      exportScanToPdf(scan);
    } finally {
      setTimeout(() => setExporting(false), 500);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header />
        <div className="mx-auto max-w-lg px-6 py-32 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h1 className="text-xl font-semibold text-zinc-100 mb-2">
            Report Not Found
          </h1>
          <p className="text-zinc-500 mb-8">{error}</p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Run a New Scan
          </Link>
        </div>
      </div>
    );
  }

  const grouped = scan.violations.reduce<Record<string, typeof scan.violations>>(
    (acc, v) => {
      if (!acc[v.category]) acc[v.category] = [];
      acc[v.category].push(v);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/scan"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            New Scan
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-zinc-50">
                Accessibility Report
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                <a
                  href={scan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {scan.url}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(scan.scannedAt).toLocaleString()}
                </span>
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600 disabled:opacity-50 transition-colors shrink-0"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export PDF
            </button>
          </div>

          <div className="mb-4 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-zinc-100 tabular-nums">
              {scan.summary.total}
            </span>
            <span className="text-zinc-500">
              issue{scan.summary.total !== 1 ? "s" : ""} found
            </span>
          </div>

          <SummaryCards summary={scan.summary} />

          <div className="mt-12 space-y-10">
            {Object.entries(grouped).map(([category, violations]) => (
              <section key={category}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-lg font-semibold text-zinc-100">
                    {category}
                  </h2>
                  <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                    {violations.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {violations.map((v) => (
                    <ViolationCard key={v.id} violation={v} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}