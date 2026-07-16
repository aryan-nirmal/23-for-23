import type { PeerReview, WatchlistItem } from "./types";
import { normalizeGSTIN } from "./gstin";

const WATCHLIST_KEY = "sv_watchlist";
const REVIEWS_KEY = "sv_reviews";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getWatchlist(): WatchlistItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? (JSON.parse(raw) as WatchlistItem[]) : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(item: WatchlistItem): void {
  if (!isBrowser()) return;
  const list = getWatchlist();
  const exists = list.some((w) => w.gstin === item.gstin);
  if (!exists) {
    list.unshift(item);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  }
}

export function removeFromWatchlist(gstin: string): void {
  if (!isBrowser()) return;
  const normalized = normalizeGSTIN(gstin);
  const list = getWatchlist().filter((w) => w.gstin !== normalized);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

export function isInWatchlist(gstin: string): boolean {
  const normalized = normalizeGSTIN(gstin);
  return getWatchlist().some((w) => w.gstin === normalized);
}

export function getReviews(gstin?: string): PeerReview[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    const all: PeerReview[] = raw ? JSON.parse(raw) : [];
    if (gstin) {
      const normalized = normalizeGSTIN(gstin);
      return all.filter((r) => r.gstin === normalized);
    }
    return all;
  } catch {
    return [];
  }
}

export function addReview(review: Omit<PeerReview, "id" | "createdAt">): PeerReview {
  const newReview: PeerReview = {
    ...review,
    gstin: normalizeGSTIN(review.gstin),
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if (isBrowser()) {
    const all = getReviews();
    all.unshift(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
  }

  return newReview;
}