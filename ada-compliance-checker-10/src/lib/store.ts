import type { ScanResult } from "./types";

const scans = new Map<string, ScanResult>();

export function saveScan(scan: ScanResult): void {
  scans.set(scan.id, scan);
}

export function getScan(id: string): ScanResult | undefined {
  return scans.get(id);
}

export function getAllScans(): ScanResult[] {
  return Array.from(scans.values()).sort(
    (a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
  );
}