import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Lock,
  Milestone,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";
import { Nav } from "@/components/Nav";

const features = [
  {
    icon: Lock,
    title: "Escrow Protection",
    description:
      "Client funds are held securely in escrow until work is approved — no more payment disputes.",
  },
  {
    icon: Milestone,
    title: "Milestone Workflow",
    description:
      "Break projects into milestones with clear deliverables, due dates, and staged payments.",
  },
  {
    icon: IndianRupee,
    title: "Razorpay Integration",
    description:
      "Mock Razorpay-style checkout for funding milestones and releasing payments to freelancers.",
  },
  {
    icon: CheckCircle2,
    title: "Full Audit Trail",
    description:
      "Every fund and release transaction is logged in the ledger for complete transparency.",
  },
];

const steps = [
  { step: "01", title: "Create Project", desc: "Define milestones with amounts and due dates" },
  { step: "02", title: "Fund Escrow", desc: "Client pays into escrow via Razorpay checkout" },
  { step: "03", title: "Deliver Work", desc: "Freelancer submits completed milestone work" },
  { step: "04", title: "Release Payment", desc: "Client approves and funds are released" },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden border-b border-zinc-800/80">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
                <Shield className="h-4 w-4" />
                Freelancer Payment Protection
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-6xl">
                Get paid for every{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  milestone
                </span>{" "}
                you deliver
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                EscrowPay protects freelancers with milestone-based escrow. Clients fund
                upfront, you deliver work, they approve — and payment releases instantly.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/projects/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
                >
                  Create a Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-zinc-100">
            How it works
          </h2>
          <p className="mt-2 text-center text-zinc-500">
            A simple four-step escrow workflow
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl border border-zinc-800 bg-zinc-900/30 p-6"
              >
                <span className="text-3xl font-bold text-emerald-500/30">
                  {item.step}
                </span>
                <h3 className="mt-3 font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-zinc-800/80 bg-zinc-900/20">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-center text-2xl font-semibold text-zinc-100">
              Built for trust
            </h2>
            <p className="mt-2 text-center text-zinc-500">
              Everything you need to manage protected payments
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">{title}</h3>
                    <p className="mt-1 text-sm text-zinc-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800/80">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
            <p className="text-zinc-500">
              Ready to protect your next project?
            </p>
            <Link
              href="/projects/new"
              className="mt-4 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}