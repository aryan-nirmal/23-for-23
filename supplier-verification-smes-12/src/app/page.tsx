import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Star,
  Bookmark,
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "GSTIN Verification",
    description:
      "Instantly validate any 15-character GSTIN and retrieve registration details, state, and status.",
  },
  {
    icon: TrendingUp,
    title: "Trust Score",
    description:
      "Composite score from registration status, peer ratings, delivery performance, and payment reliability.",
  },
  {
    icon: Star,
    title: "Peer Reviews",
    description:
      "Community-driven reviews across delivery, quality, pricing, communication, and payment categories.",
  },
  {
    icon: Bookmark,
    title: "Watchlist",
    description:
      "Save suppliers you want to monitor. Your watchlist persists locally in your browser.",
  },
];

const steps = [
  "Enter a supplier's 15-character GSTIN",
  "Review registration details and trust score",
  "Read peer reviews or submit your own",
  "Add trusted suppliers to your watchlist",
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Built for Indian SMEs
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Verify Suppliers
              <span className="block text-emerald-400">Before You Trust</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              VerifySME helps small and medium enterprises validate supplier
              GSTINs, assess trustworthiness, and make informed procurement
              decisions with peer-driven insights.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/verify"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                <Search className="h-4 w-4" />
                Verify a GSTIN
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/review"
                className="flex items-center gap-2 rounded-xl border border-zinc-700 px-8 py-3.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800/50"
              >
                <Star className="h-4 w-4" />
                Submit a Review
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-zinc-100 sm:text-3xl">
            Everything You Need to Vet Suppliers
          </h2>
          <p className="mt-3 text-zinc-400">
            A complete toolkit for supplier due diligence
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 transition group-hover:bg-emerald-500/20">
                <Icon className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-100">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800/60 bg-zinc-900/20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 sm:text-3xl">
                How It Works
              </h2>
              <p className="mt-3 text-zinc-400">
                Four simple steps to verify any Indian supplier
              </p>
              <ul className="mt-8 space-y-4">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/20">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-sm text-zinc-300">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
                <Users className="h-4 w-4" />
                Trust Score Components
              </div>
              <div className="space-y-3">
                {[
                  "Registration Verified",
                  "Peer Rating",
                  "Delivery Score",
                  "Payment Reliability",
                ].map((comp) => (
                  <div
                    key={comp}
                    className="flex items-center gap-3 rounded-lg bg-zinc-900 px-4 py-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-zinc-300">{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/60">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-100">
            Ready to verify your next supplier?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-zinc-400">
            Start with any valid 15-character GSTIN. No account required.
          </p>
          <Link
            href="/verify"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}