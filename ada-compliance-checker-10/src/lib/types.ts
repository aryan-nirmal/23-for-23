export type Severity = "critical" | "serious" | "moderate" | "minor";

export type Violation = {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  severity: Severity;
  category: string;
  selector: string;
  fix: string;
  wcagCriteria: string;
};

export type ScanSummary = {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
  total: number;
};

export type ScanResult = {
  id: string;
  url: string;
  scannedAt: string;
  violations: Violation[];
  summary: ScanSummary;
};