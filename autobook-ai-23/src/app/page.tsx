import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Mail,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Mail,
    title: "Inbox Intelligence",
    description:
      "Scans incoming emails and detects booking intent with high-confidence AI classification.",
  },
  {
    icon: Clock,
    title: "Smart Slot Proposals",
    description:
      "Cross-references your calendar and working hours to propose optimal meeting times.",
  },
  {
    icon: Calendar,
    title: "One-Click Confirm",
    description:
      "Confirm bookings instantly — events are added to your calendar automatically.",
  },
  {
    icon: Zap,
    title: "Zero Back-and-Forth",
    description:
      "Drafts polished reply emails with proposed slots, cutting scheduling time by 90%.",
  },
];

const steps = [
  "Connect your Gmail account",
  "AI scans inbox for booking requests",
  "Review detected intent & proposed slots",
  "Confirm — calendar updated instantly",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-800 px-8 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-zinc-100">Autobook AI</span>
          </div>
          <Link
            href="/inbox"
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
          >
            Open Inbox
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-8 py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          AI Booking Agent for Busy Professionals
        </div>

        <h1 className="mb-6 max-w-3xl text-5xl font-bold tracking-tight text-zinc-50">
          Stop scheduling.
          <br />
          <span className="text-violet-400">Start booking.</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Autobook AI reads your inbox, detects meeting requests, and proposes
          the perfect time slots — so you never play calendar ping-pong again.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/inbox"
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-violet-500"
          >
            View Booking Inbox
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/calendar"
            className="flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-base font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-900"
          >
            <Calendar className="h-5 w-5" />
            See Calendar
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-900/50 px-8 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-zinc-100">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step}
                className="flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-center"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/20 text-sm font-bold text-violet-400">
                  {i + 1}
                </div>
                <p className="text-sm text-zinc-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-zinc-100">
            Built for speed
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600/20">
                  <Icon className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-zinc-100">{title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 px-8 py-12">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 text-sm text-zinc-500">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Gmail integration ready
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Mon–Fri 9–5 availability
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            AI intent detection
          </span>
        </div>
      </section>
    </div>
  );
}