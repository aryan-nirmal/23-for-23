"use client";

import type { EnvVar } from "@/lib/types";
import { cn, maskValue } from "@/lib/utils";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface EnvVarRowProps {
  envVar: EnvVar;
  onEdit: (envVar: EnvVar) => void;
  onDelete: (id: string) => void;
}

export function EnvVarRow({ envVar, onEdit, onDelete }: EnvVarRowProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 hover:border-zinc-700 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm text-emerald-400 truncate">{envVar.key}</div>
        <div
          className={cn(
            "font-mono text-xs mt-1 truncate",
            revealed ? "text-zinc-300" : "text-zinc-500 tracking-wider"
          )}
        >
          {revealed ? envVar.value : maskValue(envVar.value)}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setRevealed(!revealed)}
          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          title={revealed ? "Hide value" : "Reveal value"}
        >
          {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => onEdit(envVar)}
          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(envVar.id)}
          className="rounded-md p-2 text-zinc-400 hover:bg-red-950 hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}