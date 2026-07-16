import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  MapPin,
  Shield,
  Zap,
} from "lucide-react";
import { Header } from "@/components/Header";
import { INDIAN_STATES } from "@/lib/types";

const FEATURES = [
  {
    icon: MapPin,
    title: "State-Specific Clauses",
    description:
      "Pre-built legal clause presets for Maharashtra, Karnataka, Delhi, Tamil Nadu, and 6 more states.",
  },
  {
    icon: Zap,
    title: "5-Minute Setup",
    description:
      "Multi-step guided form for landlord, tenant, property, and rent terms — no legal jargon required.",
  },
  {
    icon: FileText,
    title: "Instant Preview",
    description:
      "Review the full agreement with merged data before downloading. Edit anytime.",
  },
  {
    icon: Shield,
    title: "PDF Download",
    description:
      "Download a formatted PDF ready for stamp paper printing and registration.",
  },
];

const STEPS = [
  "Select your state",
  "Enter landlord & tenant details",
  "Add property information",
  "Set rent, deposit & duration",
  "Preview & download PDF",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 px-4 py-20 sm:px-6 sm:py-28">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-emerald-100 backdrop-blur">
              <FileText className="h-4 w-4" />
              Indian Residential Rent Agreements
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Generate Your Rent Agreement in Minutes
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-100">
              Create a professional, state-compliant residential rent agreement
              for any property in India. Free, fast, and ready to print.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl"
              >
                Create Agreement
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-emerald-200">
              Supports {INDIAN_STATES.length} Indian states · No signup required
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Everything You Need
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-slate-500">
              A complete rent agreement workflow — from form to PDF — built for
              Indian landlords and tenants.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              How It Works
            </h2>
            <ol className="mt-10 space-y-4">
              {STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-5 py-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="font-medium text-slate-700">{step}</span>
                  {index === STEPS.length - 1 && (
                    <CheckCircle className="ml-auto h-5 w-5 text-emerald-500" />
                  )}
                </li>
              ))}
            </ol>
            <div className="mt-10 text-center">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* States */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Supported States
            </h2>
            <p className="mt-3 text-slate-500">
              Each state includes tailored stamp duty notes, registration
              guidance, and jurisdiction clauses.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {INDIAN_STATES.map((state) => (
                <span
                  key={state}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600"
                >
                  {state}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-slate-200 bg-slate-100 px-4 py-8 sm:px-6">
          <p className="mx-auto max-w-3xl text-center text-xs text-slate-500">
            <strong>Disclaimer:</strong> This tool generates draft rent
            agreements for informational purposes only. It does not constitute
            legal advice. Please consult a qualified advocate and ensure proper
            stamp duty payment and registration as per your state&apos;s laws
            before executing the agreement.
          </p>
        </section>
      </main>
    </div>
  );
}