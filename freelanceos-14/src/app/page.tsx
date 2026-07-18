import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  FileText,
  FolderKanban,
  ScrollText,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Project Management",
    description: "Track tasks, timelines, and deliverables across all your client work.",
  },
  {
    icon: Users,
    title: "Client CRM",
    description: "Keep contact details, notes, and project history in one organized place.",
  },
  {
    icon: FileText,
    title: "Invoicing",
    description: "Create, send, and track invoices with clear status visibility.",
  },
  {
    icon: ScrollText,
    title: "Contracts",
    description: "Reusable contract templates ready to preview and customize.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-100">FreelanceOS</span>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
          >
            Open Dashboard
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            <Zap className="h-3 w-3" />
            All-in-one freelance workspace
          </div>
          <h1 className="mx-auto max-w-3xl text-5xl font-bold tracking-tight text-zinc-50">
            Run your freelance business from{" "}
            <span className="text-violet-400">one dashboard</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
            Projects, clients, invoices, and contracts — everything you need to
            stay organized and get paid, without juggling a dozen tools.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
            >
              View Projects
            </Link>
          </div>
        </section>

        <section className="border-t border-zinc-800/60 bg-zinc-900/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-12 text-center text-2xl font-semibold text-zinc-100">
              Everything in one place
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/15">
                    <Icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-zinc-100">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-2xl font-semibold text-zinc-100">
              Client portal included
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-zinc-400">
              Share a read-only portal link so clients can check project status
              without back-and-forth emails.
            </p>
            <Link
              href="/portal/client-1"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              View sample portal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/60 py-8 text-center text-xs text-zinc-600">
        FreelanceOS MVP — Built with Next.js 16
      </footer>
    </div>
  );
}