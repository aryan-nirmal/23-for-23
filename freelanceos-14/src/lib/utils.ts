import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, isPast, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return format(parseISO(date), "MMM d, yyyy");
}

export function formatRelativeDate(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true });
}

export function isOverdue(date: string): boolean {
  return isPast(parseISO(date));
}