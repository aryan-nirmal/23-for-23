import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, BookOpen } from "lucide-react";
import { Nav } from "@/components/Nav";
import { listTransactions } from "@/lib/store";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";

export default function LedgerPage() {
  const transactions = listTransactions();

  const totalFunded = transactions
    .filter((t) => t.type === "fund")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReleased = transactions
    .filter((t) => t.type === "release")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <Nav activePath="/ledger" />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Transaction Ledger</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Complete history of escrow fund and release payments
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Total Transactions
            </p>
            <p className="mt-2 text-2xl font-bold text-zinc-100">
              {transactions.length}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Total Funded
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-400">
              {formatCurrency(totalFunded)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Total Released
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {formatCurrency(totalReleased)}
            </p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 ring-1 ring-zinc-800">
              <BookOpen className="h-8 w-8 text-zinc-600" />
            </div>
            <h2 className="mt-6 text-lg font-semibold text-zinc-300">
              No transactions yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Fund a milestone on a project to see transactions appear here.
            </p>
            <Link
              href="/projects"
              className="mt-6 text-sm text-emerald-400 hover:text-emerald-300"
            >
              View projects →
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80">
                  <th className="px-4 py-3 font-medium text-zinc-400">Type</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Project</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Milestone</th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-400 sm:table-cell">
                    Payment ID
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Amount</th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-400 md:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="bg-zinc-900/30 transition hover:bg-zinc-900/60"
                  >
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          txn.type === "fund"
                            ? "bg-blue-500/15 text-blue-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        )}
                      >
                        {txn.type === "fund" ? (
                          <ArrowDownLeft className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {txn.type === "fund" ? "Fund" : "Release"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/projects/${txn.projectId}`}
                        className="text-zinc-200 hover:text-emerald-400 transition"
                      >
                        {txn.clientName}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400">{txn.milestoneTitle}</td>
                    <td className="hidden px-4 py-3.5 font-mono text-xs text-zinc-500 sm:table-cell">
                      {txn.paymentId}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-zinc-200">
                      {formatCurrency(txn.amount)}
                    </td>
                    <td className="hidden px-4 py-3.5 text-zinc-500 md:table-cell">
                      {formatDateTime(txn.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}