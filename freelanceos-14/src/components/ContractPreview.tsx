"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import type { Contract } from "@/lib/store";
import { formatDate } from "@/lib/utils";

interface ContractPreviewProps {
  contract: Contract;
}

export function ContractPreview({ contract }: ContractPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
      >
        <Eye className="h-3.5 w-3.5" />
        Preview
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-800 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-50">
                  {contract.name}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Updated {formatDate(contract.updatedAt)}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-300">
                {contract.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}