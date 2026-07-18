import Link from "next/link";
import { Shield, FolderKanban, BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/ledger", label: "Ledger", icon: BookOpen },
];

export function Nav({ activePath }: { activePath?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/30 transition group-hover:bg-emerald-500/20">
            <Shield className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-semibold text-zinc-100">EscrowPay</span>
            <span className="block text-[10px] text-zinc-500">Payment Protection</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                activePath === href
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <Link
            href="/projects/new"
            className="ml-2 flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Project</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}