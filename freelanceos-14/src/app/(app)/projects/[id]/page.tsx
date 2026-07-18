import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  File,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getClientById,
  getProjectById,
  getTasksByProjectId,
  getTimelineByProjectId,
} from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) notFound();

  const client = getClientById(project.clientId);
  const tasks = getTasksByProjectId(id);
  const timeline = getTimelineByProjectId(id);

  return (
    <div>
      <PageHeader
        title={project.name}
        description={project.description}
        action={<StatusBadge status={project.status} />}
      />
      <div className="p-8">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
            <DollarSign className="h-4 w-4 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Budget</p>
              <p className="text-sm font-medium text-zinc-100">
                {formatCurrency(project.budget)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Deadline</p>
              <p className="text-sm font-medium text-zinc-100">
                {formatDate(project.deadline)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Started</p>
              <p className="text-sm font-medium text-zinc-100">
                {formatDate(project.startDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl border border-zinc-800 bg-zinc-950">
              <div className="border-b border-zinc-800 px-5 py-4">
                <h2 className="text-sm font-semibold text-zinc-100">Tasks</h2>
              </div>
              <ul className="divide-y divide-zinc-800">
                {tasks.length === 0 ? (
                  <li className="px-5 py-8 text-center text-sm text-zinc-500">
                    No tasks yet
                  </li>
                ) : (
                  tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between px-5 py-3.5"
                    >
                      <span className="text-sm text-zinc-200">{task.title}</span>
                      <div className="flex items-center gap-3">
                        {task.dueDate && (
                          <span className="text-xs text-zinc-500">
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                        <StatusBadge status={task.status} />
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-950">
              <div className="border-b border-zinc-800 px-5 py-4">
                <h2 className="text-sm font-semibold text-zinc-100">Timeline</h2>
              </div>
              <ul className="divide-y divide-zinc-800">
                {timeline.length === 0 ? (
                  <li className="px-5 py-8 text-center text-sm text-zinc-500">
                    No timeline events
                  </li>
                ) : (
                  timeline.map((event) => (
                    <li key={event.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-zinc-100">
                            {event.title}
                          </p>
                          {event.description && (
                            <p className="mt-1 text-xs text-zinc-500">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-xs text-zinc-500">
                          {formatDate(event.date)}
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950/50">
              <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                <File className="mb-3 h-8 w-8 text-zinc-600" />
                <h2 className="text-sm font-semibold text-zinc-400">Files</h2>
                <p className="mt-1 max-w-xs text-xs text-zinc-600">
                  File uploads coming soon. Drag & drop deliverables will appear
                  here.
                </p>
              </div>
            </section>
          </div>

          <section className="rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="text-sm font-semibold text-zinc-100">
                Client Info
              </h2>
            </div>
            {client ? (
              <div className="space-y-4 px-5 py-5">
                <div>
                  <p className="text-base font-medium text-zinc-100">
                    {client.name}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
                    <Building2 className="h-3.5 w-3.5" />
                    {client.company}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <a
                    href={`mailto:${client.email}`}
                    className="hover:text-violet-400"
                  >
                    {client.email}
                  </a>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {client.phone}
                  </div>
                )}
                {client.notes && (
                  <p className="rounded-lg bg-zinc-900 p-3 text-xs leading-relaxed text-zinc-500">
                    {client.notes}
                  </p>
                )}
                <Link
                  href={`/portal/${client.id}`}
                  className="inline-block text-xs font-medium text-violet-400 hover:text-violet-300"
                >
                  View client portal →
                </Link>
              </div>
            ) : (
              <p className="px-5 py-8 text-sm text-zinc-500">Client not found</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}