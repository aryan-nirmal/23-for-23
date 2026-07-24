import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function maskValue(value: string): string {
  if (value.length <= 4) return "••••••••••••";
  const prefix = value.slice(0, 4);
  return `${prefix}${"•".repeat(Math.min(12, value.length - 4))}`;
}

export function formatEnvFile(vars: { key: string; value: string }[]): string {
  return vars.map((v) => `${v.key}=${escapeEnvValue(v.value)}`).join("\n");
}

function escapeEnvValue(value: string): string {
  if (/[\s#"'\\]/.test(value)) {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return value;
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}