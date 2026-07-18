import { ScrollText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ContractPreview } from "@/components/ContractPreview";
import { getContracts } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function ContractsPage() {
  const contracts = getContracts();

  return (
    <div>
      <PageHeader
        title="Contracts"
        description="Reusable contract templates for your engagements"
      />
      <div className="p-8">
        <div className="grid gap-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600/15">
                  <ScrollText className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">
                    {contract.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {contract.description}
                  </p>
                  <p className="mt-2 text-xs text-zinc-600">
                    Last updated {formatDate(contract.updatedAt)}
                  </p>
                </div>
              </div>
              <ContractPreview contract={contract} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}