import { clsx, type ClassValue } from "clsx";
import type { MilestoneStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function statusColor(status: MilestoneStatus): string {
  const colors: Record<MilestoneStatus, string> = {
    draft: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    funded: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    in_progress: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    submitted: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    released: "bg-green-500/20 text-green-300 border-green-500/30",
  };
  return colors[status];
}

export function statusIndex(status: MilestoneStatus): number {
  const order: MilestoneStatus[] = [
    "draft",
    "funded",
    "in_progress",
    "submitted",
    "approved",
    "released",
  ];
  return order.indexOf(status);
}