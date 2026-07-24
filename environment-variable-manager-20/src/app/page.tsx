import { CopyButton } from "@/components/copy-button";
import {
  ArrowRight,
  Lock,
  Shield,
  Terminal,
  Users,
  Variable,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Lock,
    title: "Encrypted Storage",
    description: "Secrets are masked in the UI and protected with token-based access control.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share environment configs across dev, staging, and production with your team.",
  },
  {
    icon: Shield,
    title: "Audit Trail",
    description: "Every change is logged — who modified what, and when.",
  },
  {
    icon: Terminal,
    title: "CLI Integration",
    description: "Pull env vars directly into your local .env with a single command.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800/50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/20 border border-emerald-500/30">
              <Variable className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-lg font-semibold">EnvVault</span>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-4 py-1.5 text-sm text-emerald-400 mb-8">
            <Shield className="h-4 w-4" />
            Team environment variable management
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-50 mb-6">
            Manage secrets
            <br />
            <span className="text-emerald-400">across environments</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-zinc-400 mb-10">
            Centralize your team&apos;s environment variables. Organize by project
            and environment, track every change, and pull configs with the CLI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/cli"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition-colors"
            >
              <Terminal className="h-4 w-4" />
              CLI Docs
            </Link>
          </div>
        </section>

        <section className="border-t border-zinc-800/50 bg-zinc-900/30 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-semibold mb-12">How it works</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10 border border-emerald-500/20">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="font-medium text-zinc-100 mb-2">{title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-2xl font-semibold mb-8">Pull with one command</h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5 bg-zinc-900/80">
                <span className="text-xs text-zinc-500 font-mono">terminal</span>
                <CopyButton text="npx envpull --project=proj_web_app --env=production" />
              </div>
              <pre className="p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
                <span className="text-zinc-500">$</span> npx envpull --project=proj_web_app --env=production
              </pre>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/50 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-600">
          EnvVault — Project 20 · Environment Variable Manager
        </div>
      </footer>
    </div>
  );
}