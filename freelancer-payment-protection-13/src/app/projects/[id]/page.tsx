import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, IndianRupee } from "lucide-react";
import { Nav } from "@/components/Nav";
import { StatusBadge } from "@/components/Badge";
import { MilestonePipeline } from "@/components/MilestonePipeline";
import { MilestoneActions } from "@/components/MilestoneActions";
import { getProject } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    notFound();
  }

  const releasedAmount = project.milestones
    .filter((m) => m.status === "released")
    .reduce((sum, m) => sum + m.amount, 0);

  const escrowedAmount = project.milestones
    .filter((m) => ["funded", "in_progress", "submitted", "approved"].includes(m.status))
    .reduce((sum, m) => sum + m.amount, 0);

  return (
    <>
      <Nav activePath="/projects" />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">{project.clientName}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Created {formatDate(project.createdAt)} · {project.milestones.length}{" "}
              milestones
            </p>
          </div>
          <div className="flex gap-6 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-3">
            <div>
              <p className="text-xs text-zinc-500">Total Value</p>
              <p className="text-lg font-semibold text-zinc-100">
                {formatCurrency(project.totalAmount)}
              </p>
            </div>
            <div className="border-l border-zinc-800 pl-6">
              <p className="text-xs text-zinc-500">In Escrow</p>
              <p className="text-lg font-semibold text-amber-400">
                {formatCurrency(escrowedAmount)}
              </p>
            </div>
            <div className="border-l border-zinc-800 pl-6">
              <p className="text-xs text-zinc-500">Released</p>
              <p className="text-lg font-semibold text-emerald-400">
                {formatCurrency(releasedAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <h2 className="text-lg font-semibold text-zinc-200">Milestones</h2>

          {project.milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-400">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-medium text-zinc-100">
                      {milestone.title}
                    </h3>
                    <StatusBadge status={milestone.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />
                      {formatCurrency(milestone.amount)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Due {formatDate(milestone.dueDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <MilestonePipeline status={milestone.status} />
              </div>

              <div className="mt-6 border-t border-zinc-800/80 pt-5">
                <MilestoneActions projectId={project.id} milestone={milestone} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}