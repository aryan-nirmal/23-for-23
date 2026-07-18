import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { Nav } from "@/components/Nav";
import { ProjectCard } from "@/components/ProjectCard";
import { listProjects } from "@/lib/store";

export default function ProjectsPage() {
  const projects = listProjects();

  return (
    <>
      <Nav activePath="/projects" />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Projects</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage milestone-based escrow projects
            </p>
          </div>
          <Link
            href="/projects/new"
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Project</span>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 ring-1 ring-zinc-800">
              <FolderOpen className="h-8 w-8 text-zinc-600" />
            </div>
            <h2 className="mt-6 text-lg font-semibold text-zinc-300">No projects yet</h2>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Create your first project with milestones to start protecting payments.
            </p>
            <Link
              href="/projects/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}