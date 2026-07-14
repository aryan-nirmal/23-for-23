import Link from "next/link";
import { Shield } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/30 group-hover:bg-emerald-500/20 transition-colors">
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="font-semibold text-zinc-100 tracking-tight">
            ADA Checker
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/scan"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Scan
          </Link>
          <Link
            href="/scan"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            New Scan
          </Link>
        </nav>
      </div>
    </header>
  );
}