"use client";

import { AppShell } from "@/components/app-shell";
import type { AuditEntry } from "@/lib/types";
import { cn, formatTimestamp } from "@/lib/utils";
import {
  ClipboardList,
  Download,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

const actionConfig = {
  create: { icon: Plus, color: "text-emerald-400 bg-emerald-950/50 border-emerald-500/20" },
  update: { icon: Pencil, color: "text-amber-400 bg-amber-950/50 border-amber-500/20" },
  delete: { icon: Trash2, color: "text-red-400 bg-red-950/50 border-red-500/20" },
  pull: { icon: Download, color: "text-blue-400 bg-blue-950/50 border-blue-500/20" },
};

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      });
  }, []);

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-emerald-400" />
          Audit Log
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Track all changes to environment variables across projects
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading audit log...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">No audit entries yet.</div>
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {entries.map((entry) => {
              const config = actionConfig[entry.action];
              const Icon = config.icon;
              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 px-4 py-4 hover:bg-zinc-900/50 transition-colors"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                      config.color
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-zinc-200 capitalize">
                        {entry.action}
                      </span>
                      <span className="text-xs text-zinc-600">·</span>
                      <span className="text-sm text-zinc-400 font-mono truncate">
                        {entry.resource}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-0.5">{entry.details}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-600">
                      <span>{entry.user}</span>
                      <span>·</span>
                      <span>{formatTimestamp(entry.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AppShell>
  );
}