import Link from "next/link";
import { Building2, Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { getClients, getProjectsByClientId } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function ClientsPage() {
  const clients = getClients();

  return (
    <div>
      <PageHeader
        title="Clients"
        description={`${clients.length} clients in your CRM`}
      />
      <div className="p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {clients.map((client) => {
            const projects = getProjectsByClientId(client.id);
            const activeCount = projects.filter(
              (p) => p.status === "active"
            ).length;

            return (
              <div
                key={client.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-zinc-100">
                      {client.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
                      <Building2 className="h-3.5 w-3.5" />
                      {client.company}
                    </div>
                  </div>
                  {activeCount > 0 && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      {activeCount} active
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {client.phone}
                    </div>
                  )}
                </div>

                {client.notes && (
                  <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                    {client.notes}
                  </p>
                )}

                <div className="mt-4 border-t border-zinc-800 pt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Projects ({projects.length})
                  </p>
                  {projects.length === 0 ? (
                    <p className="text-xs text-zinc-600">No projects</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {projects.map((project) => (
                        <li key={project.id}>
                          <Link
                            href={`/projects/${project.id}`}
                            className="flex items-center justify-between text-xs hover:text-violet-400"
                          >
                            <span className="text-zinc-300">{project.name}</span>
                            <StatusBadge status={project.status} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-600">
                    Since {formatDate(client.createdAt)}
                  </span>
                  <Link
                    href={`/portal/${client.id}`}
                    className="text-xs font-medium text-violet-400 hover:text-violet-300"
                  >
                    Portal →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}