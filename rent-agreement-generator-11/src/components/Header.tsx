import Link from "next/link";
import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline">RentAgreement</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/create"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
          >
            Create Agreement
          </Link>
        </nav>
      </div>
    </header>
  );
}