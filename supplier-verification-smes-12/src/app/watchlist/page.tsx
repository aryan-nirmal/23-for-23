"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Trash2, Search, ExternalLink } from "lucide-react";
import type { WatchlistItem } from "@/lib/types";
import { getWatchlist, removeFromWatchlist } from "@/lib/storage";
import { formatDate } from "@/lib/utils";

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(getWatchlist());
    setMounted(true);
  }, []);

  function handleRemove(gstin: string) {
    removeFromWatchlist(gstin);
    setItems(getWatchlist());
  }

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          Watchlist
        </h1>
        <p className="mt-2 text-zinc-400">
          Suppliers you&apos;re monitoring. Saved locally in your browser.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
          <Bookmark className="mx-auto mb-4 h-10 w-10 text-zinc-600" />
          <p className="text-zinc-400">Your watchlist is empty.</p>
          <Link
            href="/verify"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            <Search className="h-4 w-4" />
            Verify a Supplier
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.gstin}
              className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-zinc-700"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-200">
                  {item.businessName}
                </p>
                <p className="font-mono text-xs text-zinc-500">{item.gstin}</p>
                <p className="mt-1 text-xs text-zinc-600">
                  Added {formatDate(item.addedAt)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/supplier/${item.gstin}`}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-700"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View
                </Link>
                <button
                  onClick={() => handleRemove(item.gstin)}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}