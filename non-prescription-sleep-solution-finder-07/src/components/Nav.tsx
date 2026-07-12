"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, ClipboardList, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/quiz", label: "Quiz", icon: ClipboardList },
  { href: "/results", label: "Results", icon: Moon },
  { href: "/diary", label: "Diary", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: TrendingUp },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-indigo-900/40 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center group-hover:bg-indigo-400 transition-colors">
            <Moon size={16} className="text-slate-950" />
          </div>
          <span className="font-bold text-lg text-white">RestPath</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}