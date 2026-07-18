import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { CreateInvoiceForm } from "@/components/CreateInvoiceForm";
import {
  getClientById,
  getClients,
  getInvoices,
  getProjectById,
  getProjects,
} from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InvoicesPage() {
  const invoices = getInvoices();
  const clients = getClients();
  const projects = getProjects();

  const totalOutstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Create and track client invoices"
        action={
          <CreateInvoiceForm clients={clients} projects={projects} />
        }
      />
      <div className="p-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Outstanding
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-400">
              {formatCurrency(totalOutstanding)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Collected
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">
              {formatCurrency(totalPaid)}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Invoice
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Client
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Project
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Amount
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Due
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
              {invoices.map((invoice) => {
                const client = getClientById(invoice.clientId);
                const project = invoice.projectId
                  ? getProjectById(invoice.projectId)
                  : undefined;
                return (
                  <tr key={invoice.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-zinc-100">
                        {invoice.number}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
                        {invoice.description}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-zinc-400">
                      {client?.name}
                    </td>
                    <td className="px-5 py-4 text-zinc-500">
                      {project?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 font-medium text-zinc-100">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-5 py-4 text-zinc-400">
                      {formatDate(invoice.dueDate)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}