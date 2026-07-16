export interface SupplierData {
  gstin: string;
  businessName: string;
  state: string;
  status: "Active" | "Cancelled" | "Suspended";
  registrationDate: string;
  deliveryScore: number;
  paymentReliability: number;
}

export interface TrustScore {
  overall: number;
  registrationVerified: boolean;
  peerRating: number;
  deliveryScore: number;
  paymentReliability: number;
}

export interface PeerReview {
  id: string;
  gstin: string;
  rating: number;
  category: ReviewCategory;
  notes: string;
  reviewerName: string;
  createdAt: string;
}

export type ReviewCategory =
  | "delivery"
  | "quality"
  | "pricing"
  | "communication"
  | "payment";

export interface WatchlistItem {
  gstin: string;
  businessName: string;
  addedAt: string;
}