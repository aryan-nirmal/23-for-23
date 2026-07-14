import Link from "next/link";
import {
  Shield,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/Header";

const FEATURES = [
  {
    icon: Search,
    title: "URL Scanning",
    description:
      "Enter any website URL and get a comprehensive WCAG accessibility audit in seconds.",
  },
  {
    icon: AlertTriangle,
    title: "Severity Classification",
    description:
      "Issues ranked by critical, serious, moderate, and minor severity levels.",
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description:
      "View violations grouped by category with CSS selectors and fix recommendations.",
  },
  {
    icon: CheckCircle2,
    title: "PDF Export",
    description:
      "Download professional PDF reports to share with your development team.",
  },
];

const CATEGORIES = [
  "Images & Alt Text",
  "Color & Contrast",
  "Forms & Labels",
  "Heading Structure",
  "ARIA & Landmarks",
  "Keyboard Navigation",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main>
        <section className="relative overflow-hidden px-6 py-24 sm:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400">
              <Shield className="h-4 w-4" />
              WCAG 2.1 Compliance Checker
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-6xl">
              Make your website{" "}
              <span className="text-emerald-400">accessible to everyone</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed">
              Scan any URL for ADA and WCAG 2.1 violations. Get actionable fix
              recommendations with severity ratings, element selectors, and
              exportable reports.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/scan"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all hover:shadow-emerald-500/30"
              >
                Start Free Scan
                <ArrowRight className="h-5 w-5" />
              </Link>
              <span className="text-sm text-zinc-500">
                No account required
              </span>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800/50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-zinc-100 mb-12">
              Everything you need for accessibility audits
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-zinc-100">{title}</h3>
                  <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800/50 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">
              Checks we run
            </h2>
            <p className="text-zinc-500 mb-10">
              Powered by axe-core rules covering WCAG 2.1 Level A and AA
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((cat) => (
                <span
                  key={cat}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800/50 px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">
              Ready to audit your site?
            </h2>
            <p className="text-zinc-500 mb-8">
              Enter a URL and get a full accessibility report in under 10 seconds.
            </p>
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-emerald-500 transition-colors"
            >
              Scan a Website
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-sm text-zinc-600">
          <span>ADA Compliance Checker</span>
          <span>WCAG 2.1 · axe-core compatible</span>
        </div>
      </footer>
    </div>
  );
}