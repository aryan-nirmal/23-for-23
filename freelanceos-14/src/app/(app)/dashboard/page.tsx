import Link from "next/link";
import { Calendar, FileText, FolderKanban, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getActiveProjects,
  getClientById,
  getPendingInvoices,
  getUpcomingDeadlines,
} from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const activeProjects = getActiveProjects();
  const pendingInvoices = getPendingInvoices();
  const upcomingDeadlines = getUpcomingDeadlines(30);
  const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your freelance workspace"
      />
      <div className="p-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-2 text-zinc-400">
              <FolderKanban className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Active Projects
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-zinc-50">
              {activeProjects.length}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-2 text-zinc-400">
              <FileText className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Pending Invoices
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-zinc-50">
              {pendingInvoices.length}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {formatCurrency(pendingTotal)} outstanding
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Upcoming Deadlines
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-zinc-50">
              {upcomingDeadlines.length}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Next 30 days</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <h2 className="text-sm font-semibold text-zinc-100">
                Active Projects
              </h2>
              <Link
                href="/projects"
                className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="divide-y divide-zinc-800">
              {activeProjects.length === 0 ? (
                <li className="px-5 py-8 text-center text-sm text-zinc-500">
                  No active projects
                </li>
              ) : (
                activeProjects.map((project) => {
                  const client = getClientById(project.clientId);
                  return (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.id}`}
                        className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-900"
                      >
                        <div>
                          <p className="text-sm font-medium text-zinc-100">
                            {project.name}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {client?.company}
                          </p>
                        </div>
                        <div className="text-right">
                          <StatusBadge status={project.status} />
                          <p className="mt-1 text-xs text-zinc-500">
                            Due {formatDate(project.deadline)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <h2 className="text-sm font-semibold text-zinc-100">
                Pending Invoices
              </h2>
              <Link
                href="/invoices"
                className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="divide-y divide-zinc-800">
              {pendingInvoices.length === 0 ? (
                <li className="px-5 py-8 text-center text-sm text-zinc-500">
                  No pending invoices
                </li>
              ) : (
                pendingInvoices.map((invoice) => {
                  const client = getClientById(invoice.clientId);
                  return (
                    <li
                      key={invoice.id}
                      className="flex items-center justify-between px-5 py-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-100">
                          {invoice.number}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {client?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-zinc-100">
                          {formatCurrency(invoice.amount)}
                        </p>
                        <div className="mt-1 flex justify-end">
                          <StatusBadge status={invoice.status} />
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-950 lg:col-span-2">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="text-sm font-semibold text-zinc-100">
                Upcoming Deadlines
              </h2>
            </div>
            <ul className="divide-y divide-zinc-800">
              {upcomingDeadlines.length === 0 ? (
                <li className="px-5 py-8 text-center text-sm text-zinc-500">
                  No deadlines in the next 30 days
                </li>
              ) : (
                upcomingDeadlines.map((project) => {
                  const client = getClientById(project.clientId);
                  return (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.id}`}
                        className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-900"
                      >
                        <div>
                          <p className="text-sm font-medium text-zinc-100">
                            {project.name}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {client?.company}
                          </p>
                        </div>
                        <p className="text-sm text-amber-400">
                          {formatDate(project.deadline)}
                        </p>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}