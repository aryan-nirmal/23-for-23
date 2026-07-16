"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle, Loader2 } from "lucide-react";
import { validateGSTIN, normalizeGSTIN } from "@/lib/gstin";
import { cn } from "@/lib/utils";

export default function VerifyPage() {
  const router = useRouter();
  const [gstin, setGstin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validation = validateGSTIN(gstin);
    if (!validation.valid) {
      setError(validation.error ?? "Invalid GSTIN");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstin: normalizeGSTIN(gstin) }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Verification failed");
        return;
      }

      router.push(`/supplier/${data.supplier.gstin}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          Verify Supplier GSTIN
        </h1>
        <p className="mt-2 text-zinc-400">
          Enter a 15-character GSTIN to look up supplier registration details
          and trust score.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="gstin"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              GSTIN Number
            </label>
            <div className="relative">
              <input
                id="gstin"
                type="text"
                value={gstin}
                onChange={(e) => {
                  setGstin(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="e.g. 27AABCU9603R1ZM"
                maxLength={15}
                className={cn(
                  "w-full rounded-xl border bg-zinc-950 px-4 py-3.5 pr-12 font-mono text-lg tracking-wider text-zinc-100 placeholder:text-zinc-600 outline-none transition",
                  error
                    ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                    : "border-zinc-700 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                )}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
                {gstin.length}/15
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Verify GSTIN
              </>
            )}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-zinc-950/50 p-4">
          <p className="text-xs font-medium text-zinc-500">GSTIN Format</p>
          <p className="mt-1 font-mono text-xs text-zinc-600">
            SS + PAN(10) + Entity(1) + Z + Checksum(1) = 15 chars
          </p>
          <p className="mt-2 text-xs text-zinc-600">
            Try: <button type="button" onClick={() => setGstin("27AABCU9603R1ZM")} className="font-mono text-emerald-500/70 hover:text-emerald-400">27AABCU9603R1ZM</button>
            {" · "}
            <button type="button" onClick={() => setGstin("09AAACH7409R1ZZ")} className="font-mono text-emerald-500/70 hover:text-emerald-400">09AAACH7409R1ZZ</button>
          </p>
        </div>
      </div>
    </div>
  );
}