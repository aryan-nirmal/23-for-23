import Link from "next/link";
import { ArrowRight, IndianRupee } from "lucide-react";
import type { Project } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "./Badge";

export function ProjectCard({ project }: { project: Project }) {
  const released = project.milestones.filter((m) => m.status === "released").length;
  const progress = Math.round((released / project.milestones.length) * 100);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700 hover:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-emerald-400 transition">
            {project.clientName}
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            {project.milestones.length} milestone
            {project.milestones.length !== 1 ? "s" : ""} · Created{" "}
            {formatDate(project.createdAt)}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-zinc-600 transition group-hover:text-emerald-400 group-hover:translate-x-0.5" />
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5 text-zinc-300">
          <IndianRupee className="h-4 w-4 text-emerald-500" />
          {formatCurrency(project.totalAmount)}
        </span>
        <span className="text-zinc-600">·</span>
        <span className="text-zinc-400">{progress}% released</span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.milestones.slice(0, 3).map((m) => (
          <StatusBadge key={m.id} status={m.status} />
        ))}
        {project.milestones.length > 3 && (
          <span className="text-xs text-zinc-500 self-center">
            +{project.milestones.length - 3} more
          </span>
        )}
      </div>
    </Link>
  );
}