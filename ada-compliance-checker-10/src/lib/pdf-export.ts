import { jsPDF } from "jspdf";
import type { ScanResult } from "./types";

const SEVERITY_COLORS: Record<string, [number, number, number]> = {
  critical: [220, 38, 38],
  serious: [234, 88, 12],
  moderate: [202, 138, 4],
  minor: [59, 130, 246],
};

export function exportScanToPdf(scan: ScanResult): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(needed: number) {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text("ADA Compliance Scan Report", margin, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`URL: ${scan.url}`, margin, y);
  y += 6;
  doc.text(
    `Scanned: ${new Date(scan.scannedAt).toLocaleString()}`,
    margin,
    y
  );
  y += 6;
  doc.text(`Scan ID: ${scan.id}`, margin, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Summary", margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const summaryLines = [
    `Total Issues: ${scan.summary.total}`,
    `Critical: ${scan.summary.critical}`,
    `Serious: ${scan.summary.serious}`,
    `Moderate: ${scan.summary.moderate}`,
    `Minor: ${scan.summary.minor}`,
  ];
  for (const line of summaryLines) {
    doc.text(line, margin, y);
    y += 5;
  }
  y += 5;

  const grouped = scan.violations.reduce<Record<string, typeof scan.violations>>(
    (acc, v) => {
      if (!acc[v.category]) acc[v.category] = [];
      acc[v.category].push(v);
      return acc;
    },
    {}
  );

  for (const [category, violations] of Object.entries(grouped)) {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(category, margin, y);
    y += 7;

    for (const v of violations) {
      checkPageBreak(30);

      const color = SEVERITY_COLORS[v.severity] ?? [100, 100, 100];
      doc.setTextColor(...color);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(`[${v.severity.toUpperCase()}] ${v.title}`, margin, y);
      y += 5;

      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Selector: ${v.selector}`, margin, y);
      y += 4;
      doc.text(`WCAG: ${v.wcagCriteria}`, margin, y);
      y += 4;

      const fixLines = doc.splitTextToSize(`Fix: ${v.fix}`, contentWidth);
      doc.text(fixLines, margin, y);
      y += fixLines.length * 4 + 4;
    }
    y += 3;
  }

  doc.save(`ada-scan-${scan.id.slice(0, 8)}.pdf`);
}