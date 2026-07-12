import type { DiaryEntry } from "./types";

export const DIARY_STORAGE_KEY = "sleepfinder-diary";

export function loadDiaryEntries(): DiaryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DIARY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DiaryEntry[];
    return parsed.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export function saveDiaryEntries(entries: DiaryEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(entries));
}

export function addDiaryEntry(
  entry: Omit<DiaryEntry, "id" | "createdAt">
): DiaryEntry {
  const newEntry: DiaryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const existing = loadDiaryEntries();
  const filtered = existing.filter((e) => e.date !== entry.date);
  const updated = [newEntry, ...filtered].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  saveDiaryEntries(updated);
  return newEntry;
}

export function deleteDiaryEntry(id: string): void {
  const updated = loadDiaryEntries().filter((e) => e.id !== id);
  saveDiaryEntries(updated);
}

export function getDiaryStats(entries: DiaryEntry[]) {
  if (entries.length === 0) {
    return {
      avgHours: 0,
      avgQuality: 0,
      totalEntries: 0,
      bestNight: null as DiaryEntry | null,
      worstNight: null as DiaryEntry | null,
      trend: "stable" as "improving" | "declining" | "stable",
    };
  }

  const avgHours =
    entries.reduce((sum, e) => sum + e.hoursSlept, 0) / entries.length;
  const avgQuality =
    entries.reduce((sum, e) => sum + e.quality, 0) / entries.length;

  const sorted = [...entries].sort((a, b) => b.quality - a.quality);
  const bestNight = sorted[0];
  const worstNight = sorted[sorted.length - 1];

  let trend: "improving" | "declining" | "stable" = "stable";
  if (entries.length >= 4) {
    const recent = entries.slice(0, Math.ceil(entries.length / 2));
    const older = entries.slice(Math.ceil(entries.length / 2));
    const recentAvg =
      recent.reduce((s, e) => s + e.quality, 0) / recent.length;
    const olderAvg = older.reduce((s, e) => s + e.quality, 0) / older.length;
    if (recentAvg - olderAvg > 0.3) trend = "improving";
    else if (olderAvg - recentAvg > 0.3) trend = "declining";
  }

  return {
    avgHours,
    avgQuality,
    totalEntries: entries.length,
    bestNight,
    worstNight,
    trend,
  };
}

export function getLast14Days(entries: DiaryEntry[]): {
  date: string;
  hoursSlept: number;
  quality: number;
}[] {
  const today = new Date();
  const days: { date: string; hoursSlept: number; quality: number }[] = [];

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const entry = entries.find((e) => e.date === dateStr);
    days.push({
      date: dateStr,
      hoursSlept: entry?.hoursSlept ?? 0,
      quality: entry?.quality ?? 0,
    });
  }

  return days;
}