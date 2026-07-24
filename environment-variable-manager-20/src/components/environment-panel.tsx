"use client";

import type { EnvVar, Environment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EnvVarForm } from "./env-var-form";
import { EnvVarRow } from "./env-var-row";

interface EnvironmentPanelProps {
  env: Environment;
  envVars: EnvVar[];
  projectId: string;
  onRefresh: () => void;
}

const envLabels: Record<Environment, { label: string; color: string }> = {
  dev: { label: "Development", color: "text-blue-400 border-blue-500/30 bg-blue-950/30" },
  staging: { label: "Staging", color: "text-amber-400 border-amber-500/30 bg-amber-950/30" },
  production: { label: "Production", color: "text-red-400 border-red-500/30 bg-red-950/30" },
};

export function EnvironmentPanel({
  env,
  envVars,
  projectId,
  onRefresh,
}: EnvironmentPanelProps) {
  const [editing, setEditing] = useState<EnvVar | null>(null);
  const { label, color } = envLabels[env];

  async function handleAdd(key: string, value: string) {
    await fetch("/api/env-vars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, env, key, value }),
    });
    setEditing(null);
    onRefresh();
  }

  async function handleEdit(key: string, value: string) {
    if (!editing) return;
    await fetch("/api/env-vars", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, env, id: editing.id, key, value }),
    });
    setEditing(null);
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this environment variable?")) return;
    await fetch("/api/env-vars", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, env, id }),
    });
    onRefresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
            color
          )}
        >
          {label}
        </span>
        <span className="text-xs text-zinc-500">
          {envVars.length} variable{envVars.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-2">
        {envVars.length === 0 && !editing && (
          <p className="text-sm text-zinc-500 py-4 text-center">
            No variables yet. Add one below.
          </p>
        )}
        {envVars.map((v) => (
          <EnvVarRow
            key={v.id}
            envVar={v}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <EnvVarForm
        editing={editing}
        onSubmit={editing ? handleEdit : handleAdd}
        onCancel={() => setEditing(null)}
      />
    </div>
  );
}