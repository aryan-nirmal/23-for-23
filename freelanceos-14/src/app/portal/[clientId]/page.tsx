import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, Building2, CheckCircle2, Clock, PauseCircle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getClientById,
  getProjectsByClientId,
  getTasksByProjectId,
} from "@/lib/store";
import { formatDate } from "@/lib/utils";

interface PortalPageProps {
  params: Promise<{ clientId: string }>;
}

const statusIcons = {
  active: Clock,
  completed: CheckCircle2,
  on_hold: PauseCircle,
};

export default async function PortalPage({ params }: PortalPageProps) {
  const { clientId } = await params;
  const client = getClientById(clientId);

  if (!client) notFound();

  const projects = getProjectsByClientId(clientId);

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-100">
              Client Portal
            </span>
          </div>
          <span className="text-xs text-zinc-500">Read-only view</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm text-zinc-500">Welcome,</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-50">
            {client.name}
          </h1>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
            <Building2 className="h-3.5 w-3.5" />
            {client.company}
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Your Projects
          </h2>

          {projects.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-12 text-center">
              <p className="text-sm text-zinc-500">No projects to display.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => {
                const tasks = getTasksByProjectId(project.id);
                const doneCount = tasks.filter((t) => t.status === "done").length;
                const progress =
                  tasks.length > 0
                    ? Math.round((doneCount / tasks.length) * 100)
                    : 0;
                const StatusIcon = statusIcons[project.status];

                return (
                  <div
                    key={project.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-zinc-100">
                          {project.name}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          {project.description}
                        </p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className="h-3.5 w-3.5" />
                        Due {formatDate(project.deadline)}
                      </div>
                      {tasks.length > 0 && (
                        <span>
                          {doneCount}/{tasks.length} tasks complete
                        </span>
                      )}
                    </div>

                    {tasks.length > 0 && (
                      <div className="mt-4">
                        <div className="mb-1.5 flex justify-between text-xs">
                          <span className="text-zinc-500">Progress</span>
                          <span className="text-zinc-400">{progress}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-violet-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <p className="mt-10 text-center text-xs text-zinc-600">
          Powered by{" "}
          <Link href="/" className="text-violet-500 hover:text-violet-400">
            FreelanceOS
          </Link>
        </p>
      </main>
    </div>
  );
}