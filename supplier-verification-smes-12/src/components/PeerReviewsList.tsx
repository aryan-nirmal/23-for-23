import { Star, MessageSquare } from "lucide-react";
import type { PeerReview } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const CATEGORY_LABELS: Record<PeerReview["category"], string> = {
  delivery: "Delivery",
  quality: "Quality",
  pricing: "Pricing",
  communication: "Communication",
  payment: "Payment",
};

interface PeerReviewsListProps {
  reviews: PeerReview[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-zinc-700"
          }`}
        />
      ))}
    </div>
  );
}

export default function PeerReviewsList({ reviews }: PeerReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <MessageSquare className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
        <p className="text-sm text-zinc-400">No peer reviews yet.</p>
        <p className="mt-1 text-xs text-zinc-600">
          Be the first to share your experience with this supplier.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-200">
                {review.reviewerName}
              </p>
              <p className="text-xs text-zinc-500">
                {formatDate(review.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StarRating rating={review.rating} />
              <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {CATEGORY_LABELS[review.category]}
              </span>
            </div>
          </div>
          {review.notes && (
            <p className="text-sm leading-relaxed text-zinc-400">
              {review.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}