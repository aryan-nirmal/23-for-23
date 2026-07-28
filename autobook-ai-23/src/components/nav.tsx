"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Inbox,
  Settings,
  Sparkles,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Nav() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) return null;

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-100">Autobook AI</p>
          <p className="text-xs text-zinc-500">Booking Agent</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-violet-600/20 text-violet-300"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-3">
        <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2">
          <Mail className="h-4 w-4 text-emerald-400" />
          <div className="min-w-0">
            <p className="truncate text-xs text-zinc-400">Gmail connected</p>
            <p className="truncate text-xs font-medium text-emerald-400">
              you@company.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}