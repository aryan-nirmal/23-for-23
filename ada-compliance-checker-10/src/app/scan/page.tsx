"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Globe, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";

export default function ScanPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Scan failed. Please try again.");
        return;
      }

      router.push(`/report/${data.id}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="px-6 py-16">
        <div className="mx-auto max-w-xl">
          <div className="text-center mb-10">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
              <Globe className="h-7 w-7 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-50">Scan a Website</h1>
            <p className="mt-3 text-zinc-500">
              Enter a URL to run a WCAG 2.1 accessibility audit
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <label
                htmlFor="url"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Website URL
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <input
                  id="url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 py-3.5 pl-11 pr-4 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 transition-colors"
                />
              </div>
              <p className="mt-2 text-xs text-zinc-600">
                Protocol optional — https:// will be added automatically
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-base font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Run Accessibility Scan
                </>
              )}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-5">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">
              What we check
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Missing alt text on images</li>
              <li>• Insufficient color contrast ratios</li>
              <li>• Form inputs without labels</li>
              <li>• Improper heading hierarchy</li>
              <li>• ARIA attribute errors</li>
              <li>• Keyboard navigation issues</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}