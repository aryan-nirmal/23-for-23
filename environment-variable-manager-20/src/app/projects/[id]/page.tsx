"use client";

import { AppShell } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import { EnvironmentPanel } from "@/components/environment-panel";
import type { EnvVarsByEnvironment, Environment, Project, PullToken } from "@/lib/types";
import { ENVIRONMENTS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, Terminal } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [envVars, setEnvVars] = useState<EnvVarsByEnvironment | null>(null);
  const [tokens, setTokens] = useState<PullToken[]>([]);
  const [activeEnv, setActiveEnv] = useState<Environment>("dev");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchProject = useCallback(async () => {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setProject(data.project);
    setEnvVars(data.envVars);
    setTokens(data.tokens);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <AppShell>
        <div className="text-center py-12 text-zinc-500">Loading project...</div>
      </AppShell>
    );
  }

  if (notFound || !project || !envVars) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">Project not found</p>
          <Link href="/dashboard" className="text-emerald-400 hover:underline text-sm">
            Back to dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const activeToken = tokens.find((t) => t.env === activeEnv);
  const pullCommand = `npx envpull --project=${project.id} --env=${activeEnv}`;

  return (
    <AppShell>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">{project.name}</h1>
          <p className="text-sm text-zinc-500 mt-1">{project.description}</p>
          <p className="text-xs text-zinc-600 font-mono mt-2">{project.id}</p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-500">CLI Pull</span>
            <CopyButton text={pullCommand} />
          </div>
          <code className="block font-mono text-xs text-emerald-400 truncate">
            {pullCommand}
          </code>
          {activeToken && (
            <p className="text-xs text-zinc-600 mt-2 font-mono truncate">
              token: {activeToken.token}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-1 border-b border-zinc-800 mb-6">
        {ENVIRONMENTS.map((env) => (
          <button
            key={env}
            type="button"
            onClick={() => setActiveEnv(env)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium capitalize transition-colors relative",
              activeEnv === env
                ? "text-emerald-400"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {env}
            {activeEnv === env && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>
        ))}
      </div>

      <EnvironmentPanel
        env={activeEnv}
        envVars={envVars[activeEnv]}
        projectId={project.id}
        onRefresh={fetchProject}
      />
    </AppShell>
  );
}