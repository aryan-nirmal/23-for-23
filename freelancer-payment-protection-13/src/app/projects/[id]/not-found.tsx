import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function ProjectNotFound() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-100">Project not found</h1>
        <p className="mt-2 text-zinc-500">
          This project doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/projects"
          className="mt-6 inline-block text-emerald-400 hover:text-emerald-300"
        >
          ← Back to projects
        </Link>
      </main>
    </>
  );
}