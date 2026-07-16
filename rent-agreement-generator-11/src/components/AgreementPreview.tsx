"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { generateAgreement } from "@/lib/generate-agreement";
import { downloadAgreementPdf } from "@/lib/pdf";
import { loadAgreementData } from "@/lib/storage";
import type { AgreementFormData } from "@/lib/types";

export function AgreementPreview() {
  const router = useRouter();
  const [data, setData] = useState<AgreementFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = loadAgreementData();
    if (!saved) {
      router.replace("/create");
      return;
    }
    setData(saved);
    setLoading(false);
  }, [router]);

  if (loading || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-10 w-10 animate-pulse text-emerald-600" />
          <p className="mt-3 text-sm text-slate-500">Generating preview...</p>
        </div>
      </div>
    );
  }

  const sections = generateAgreement(data);

  function handleDownload() {
    downloadAgreementPdf(data!);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Agreement Preview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {data.state} · {data.property.city} · {data.rent.durationMonths}{" "}
            months
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/create">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Draft Preview — Not a legally stamped document
          </p>
        </div>
        <div className="space-y-8 p-6 sm:p-10">
          {sections.map((section, index) => (
            <section key={index}>
              <h2
                className={
                  index === 0
                    ? "text-center text-xl font-bold text-slate-900"
                    : "text-base font-semibold text-slate-800"
                }
              >
                {section.title}
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Link href="/create">
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
        </Link>
        <Button onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}