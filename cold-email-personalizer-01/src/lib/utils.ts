export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  return words.length <= maxWords ? text.trim() : `${words.slice(0, maxWords).join(" ")}...`;
}

export function compactText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function wordCount(text: string): number {
  return compactText(text).split(/\s+/).filter(Boolean).length;
}
