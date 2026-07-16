"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Calendar,
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  Loader2,
  AlertTriangle,
  Star,
} from "lucide-react";
import TrustScoreCard from "@/components/TrustScoreCard";
import PeerReviewsList from "@/components/PeerReviewsList";
import type { SupplierData } from "@/lib/types";
import { calculateTrustScore } from "@/lib/trust-score";
import {
  getReviews,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "@/lib/storage";
import { formatDate, cn } from "@/lib/utils";

export default function SupplierPage() {
  const params = useParams();
  const gstin = (params.gstin as string)?.toUpperCase();

  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [watchlisted, setWatchlisted] = useState(false);
  const [reviews, setReviews] = useState(getReviews(gstin));

  useEffect(() => {
    async function fetchSupplier() {
      try {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gstin }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Supplier not found");
          return;
        }
        setSupplier(data.supplier);
      } catch {
        setError("Failed to load supplier data");
      } finally {
        setLoading(false);
      }
    }

    if (gstin) {
      fetchSupplier();
      setWatchlisted(isInWatchlist(gstin));
      setReviews(getReviews(gstin));
    }
  }, [gstin]);

  function toggleWatchlist() {
    if (!supplier) return;
    if (watchlisted) {
      removeFromWatchlist(supplier.gstin);
      setWatchlisted(false);
    } else {
      addToWatchlist({
        gstin: supplier.gstin,
        businessName: supplier.businessName,
        addedAt: new Date().toISOString(),
      });
      setWatchlisted(true);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-red-400" />
        <h1 className="text-xl font-semibold text-zinc-100">
          Supplier Not Found
        </h1>
        <p className="mt-2 text-zinc-400">{error}</p>
        <Link
          href="/verify"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Try Another GSTIN
        </Link>
      </div>
    );
  }

  const trustScore = calculateTrustScore(supplier, reviews);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                supplier.status === "Active"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : supplier.status === "Suspended"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-red-500/10 text-red-400"
              )}
            >
              {supplier.status}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 sm:text-3xl">
            {supplier.businessName}
          </h1>
          <p className="mt-1 font-mono text-sm text-zinc-500">
            {supplier.gstin}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleWatchlist}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition",
              watchlisted
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
            )}
          >
            {watchlisted ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {watchlisted ? "Watchlisted" : "Add to Watchlist"}
          </button>
          <Link
            href={`/review?gstin=${supplier.gstin}`}
            className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700"
          >
            <Star className="h-4 w-4" />
            Write Review
          </Link>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
          <Building2 className="h-5 w-5 text-zinc-500" />
          <div>
            <p className="text-xs text-zinc-500">Business</p>
            <p className="text-sm font-medium text-zinc-200">
              {supplier.businessName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
          <MapPin className="h-5 w-5 text-zinc-500" />
          <div>
            <p className="text-xs text-zinc-500">State</p>
            <p className="text-sm font-medium text-zinc-200">
              {supplier.state}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
          <Calendar className="h-5 w-5 text-zinc-500" />
          <div>
            <p className="text-xs text-zinc-500">Registered</p>
            <p className="text-sm font-medium text-zinc-200">
              {formatDate(supplier.registrationDate)}
            </p>
          </div>
        </div>
      </div>

      {supplier.status === "Active" && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400 ring-1 ring-emerald-500/20">
          <BadgeCheck className="h-4 w-4" />
          GST registration is active and verified via mock lookup
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <TrustScoreCard score={trustScore} />
        </div>
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">
            Peer Reviews ({reviews.length})
          </h2>
          <PeerReviewsList reviews={reviews} />
        </div>
      </div>
    </div>
  );
}