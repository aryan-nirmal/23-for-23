import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/Nav";
import { CreateProjectForm } from "@/components/CreateProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-zinc-100">New Project</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Set up a client project with milestone-based escrow payments
        </p>

        <div className="mt-8">
          <CreateProjectForm />
        </div>
      </main>
    </>
  );
}