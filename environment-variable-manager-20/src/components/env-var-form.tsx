"use client";

import type { EnvVar } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface EnvVarFormProps {
  editing?: EnvVar | null;
  onSubmit: (key: string, value: string) => void;
  onCancel?: () => void;
}

export function EnvVarForm({ editing, onSubmit, onCancel }: EnvVarFormProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (editing) {
      setKey(editing.key);
      setValue(editing.value);
      setOpen(true);
    }
  }, [editing]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    onSubmit(key.trim(), value);
    if (!editing) {
      setKey("");
      setValue("");
      setOpen(false);
    }
  }

  function handleCancel() {
    setKey("");
    setValue("");
    setOpen(false);
    onCancel?.();
  }

  if (!open && !editing) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/30 px-4 py-3 text-sm text-zinc-400 hover:border-emerald-600/50 hover:text-emerald-400 hover:bg-emerald-950/20 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add variable
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-zinc-700 bg-zinc-900 p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-200">
          {editing ? "Edit variable" : "New variable"}
        </h4>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md p-1 text-zinc-500 hover:text-zinc-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Key</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))}
            placeholder="DATABASE_URL"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Value</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="secret-value"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      </div>

      <button
        type="submit"
        className={cn(
          "w-full rounded-md px-4 py-2 text-sm font-medium transition-colors",
          "bg-emerald-600 text-white hover:bg-emerald-500"
        )}
      >
        {editing ? "Save changes" : "Add variable"}
      </button>
    </form>
  );
}