import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { getClientById, getProjects } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div>
      <PageHeader
        title="Projects"
        description={`${projects.length} projects across all clients`}
      />
      <div className="p-8">
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Project
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Client
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Budget
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
              {projects.map((project) => {
                const client = getClientById(project.clientId);
                return (
                  <tr
                    key={project.id}
                    className="transition-colors hover:bg-zinc-900"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/projects/${project.id}`}
                        className="font-medium text-zinc-100 hover:text-violet-400"
                      >
                        {project.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
                        {project.description}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-zinc-400">
                      {client?.company}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-5 py-4 text-zinc-300">
                      {formatCurrency(project.budget)}
                    </td>
                    <td className="px-5 py-4 text-zinc-400">
                      {formatDate(project.deadline)}
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