import { jsPDF } from "jspdf";
import { generateAgreement } from "./generate-agreement";
import type { AgreementFormData } from "./types";

export function downloadAgreementPdf(data: AgreementFormData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const sections = generateAgreement(data);

  function addNewPageIfNeeded(height: number) {
    if (y + height > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  sections.forEach((section, index) => {
    addNewPageIfNeeded(15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(index === 0 ? 16 : 12);
    const titleLines = doc.splitTextToSize(section.title, maxWidth);
    titleLines.forEach((line: string) => {
      addNewPageIfNeeded(8);
      if (index === 0) {
        doc.text(line, pageWidth / 2, y, { align: "center" });
      } else {
        doc.text(line, margin, y);
      }
      y += index === 0 ? 10 : 7;
    });

    y += 3;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const contentLines = doc.splitTextToSize(section.content, maxWidth);
    contentLines.forEach((line: string) => {
      addNewPageIfNeeded(6);
      doc.text(line, margin, y);
      y += 5;
    });

    y += 8;
  });

  const filename = `rent-agreement-${data.tenant.fullName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
  doc.save(filename);
}