import { Header } from "@/components/Header";
import { AgreementForm } from "@/components/AgreementForm";

export const metadata = {
  title: "Create Agreement | RentAgreement",
  description: "Create a residential rent agreement for your Indian property.",
};

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Create Rent Agreement
            </h1>
            <p className="mt-2 text-slate-500">
              Fill in the details below to generate your agreement.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <AgreementForm />
          </div>
        </div>
      </main>
    </div>
  );
}