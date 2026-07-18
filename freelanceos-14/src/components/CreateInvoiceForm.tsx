"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createInvoiceAction } from "@/app/actions";
import type { Client, Project } from "@/lib/store";

interface CreateInvoiceFormProps {
  clients: Client[];
  projects: Project[];
}

export function CreateInvoiceForm({ clients, projects }: CreateInvoiceFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const clientProjects = projects.filter((p) => p.clientId === clientId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !amount || !dueDate || !description) return;

    startTransition(async () => {
      await createInvoiceAction({
        clientId,
        projectId: projectId || undefined,
        amount: parseFloat(amount),
        dueDate,
        description,
      });
      setAmount("");
      setDueDate("");
      setDescription("");
      setProjectId("");
      setIsOpen(false);
    });
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
      >
        <Plus className="h-4 w-4" />
        New Invoice
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-800 bg-zinc-950 p-6"
    >
      <h3 className="mb-4 text-sm font-semibold text-zinc-100">Create Invoice</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">
            Client
          </label>
          <select
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setProjectId("");
            }}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500"
            required
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.company}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">
            Project (optional)
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500"
          >
            <option value="">No project</option>
            {clientProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">
            Amount (USD)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Invoice description"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500"
            required
          />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Invoice"}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}