import { Header } from "@/components/Header";
import { AgreementPreview } from "@/components/AgreementPreview";

export const metadata = {
  title: "Preview Agreement | RentAgreement",
  description: "Preview and download your generated rent agreement.",
};

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <AgreementPreview />
      </main>
    </div>
  );
}