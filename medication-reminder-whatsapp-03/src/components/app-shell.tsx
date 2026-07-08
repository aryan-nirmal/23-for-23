import Link from "next/link";
import type { ReactNode } from "react";
import type { DemoSession } from "@/lib/types";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/patients/new", label: "New patient" },
  { href: "/simulator", label: "Simulator" },
];

export function AppShell({
  session,
  currentPath,
  title,
  subtitle,
  children,
}: {
  session: DemoSession;
  currentPath: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="glass-card rounded-[32px] px-6 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-[var(--accent)]">PulsePrompt</p>
              <h1 className="display mt-3 text-4xl leading-none md:text-5xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{subtitle}</p>
            </div>

            <div className="space-y-3 text-right">
              <div className="text-sm font-semibold">{session.ownerName}</div>
              <div className="text-sm text-[var(--muted)]">
                {session.email} • {session.accountType}
              </div>
              <div className="inline-flex rounded-full border border-[var(--foreground)]/10 bg-[var(--card-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Demo auth active
              </div>
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  currentPath === link.href
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "border border-[var(--foreground)]/10 bg-white/50 hover:bg-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        {children}
      </div>
    </main>
  );
}
