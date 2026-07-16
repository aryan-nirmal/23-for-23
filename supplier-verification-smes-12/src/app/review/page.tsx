"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { validateGSTIN, normalizeGSTIN } from "@/lib/gstin";
import { addReview } from "@/lib/storage";
import type { ReviewCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: ReviewCategory; label: string }[] = [
  { value: "delivery", label: "Delivery" },
  { value: "quality", label: "Quality" },
  { value: "pricing", label: "Pricing" },
  { value: "communication", label: "Communication" },
  { value: "payment", label: "Payment" },
];

function ReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillGstin = searchParams.get("gstin") ?? "";

  const [gstin, setGstin] = useState(prefillGstin);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<ReviewCategory>("delivery");
  const [notes, setNotes] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefillGstin) setGstin(prefillGstin);
  }, [prefillGstin]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validation = validateGSTIN(gstin);
    if (!validation.valid) {
      setError(validation.error ?? "Invalid GSTIN");
      return;
    }

    if (rating < 1) {
      setError("Please select a rating");
      return;
    }

    if (!reviewerName.trim()) {
      setError("Please enter your name");
      return;
    }

    const review = addReview({
      gstin: normalizeGSTIN(gstin),
      rating,
      category,
      notes: notes.trim(),
      reviewerName: reviewerName.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      router.push(`/supplier/${review.gstin}`);
    }, 1500);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-400" />
        <h2 className="text-xl font-semibold text-zinc-100">Review Submitted!</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Redirecting to supplier profile...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="gstin"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Supplier GSTIN
        </label>
        <input
          id="gstin"
          type="text"
          value={gstin}
          onChange={(e) => setGstin(e.target.value.toUpperCase())}
          placeholder="15-character GSTIN"
          maxLength={15}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono tracking-wider text-zinc-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Rating
        </label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition"
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition",
                    (hoverRating || rating) >= starValue
                      ? "fill-amber-400 text-amber-400"
                      : "text-zinc-700 hover:text-zinc-500"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ReviewCategory)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="reviewerName"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Your Name
        </label>
        <input
          id="reviewerName"
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="e.g. Rajesh Kumar"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Share your experience with this supplier..."
          className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
      >
        <Send className="h-4 w-4" />
        Submit Review
      </button>
    </form>
  );
}

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          Submit Peer Review
        </h1>
        <p className="mt-2 text-zinc-400">
          Help other SMEs by sharing your experience with a supplier.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <Suspense fallback={<div className="text-center text-zinc-500">Loading...</div>}>
          <ReviewForm />
        </Suspense>
      </div>
    </div>
  );
}