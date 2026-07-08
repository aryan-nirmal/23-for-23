import { clsx } from "clsx";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function slugTimeLabel(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return format(date, "hh:mm a");
}

export function friendlyDate(value: string) {
  return format(new Date(value), "dd MMM yyyy, hh:mm a");
}

export function relativeDate(value: string) {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function percent(numerator: number, denominator: number) {
  if (!denominator) {
    return "0%";
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}

export function toTitleCase(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((chunk) => chunk[0]?.toUpperCase() + chunk.slice(1))
    .join(" ");
}
