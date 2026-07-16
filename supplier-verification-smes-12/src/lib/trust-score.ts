import type { PeerReview, SupplierData, TrustScore } from "./types";

export function calculateTrustScore(
  supplier: SupplierData,
  reviews: PeerReview[]
): TrustScore {
  const registrationVerified = supplier.status === "Active";

  const peerRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const components = [
    registrationVerified ? 100 : 20,
    peerRating > 0 ? (peerRating / 5) * 100 : 50,
    supplier.deliveryScore,
    supplier.paymentReliability,
  ];

  const overall = Math.round(
    components.reduce((a, b) => a + b, 0) / components.length
  );

  return {
    overall,
    registrationVerified,
    peerRating: Math.round(peerRating * 10) / 10,
    deliveryScore: supplier.deliveryScore,
    paymentReliability: supplier.paymentReliability,
  };
}

export function getTrustLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 80) return { label: "Highly Trusted", color: "text-emerald-400" };
  if (score >= 60) return { label: "Moderately Trusted", color: "text-amber-400" };
  if (score >= 40) return { label: "Caution Advised", color: "text-orange-400" };
  return { label: "High Risk", color: "text-red-400" };
}