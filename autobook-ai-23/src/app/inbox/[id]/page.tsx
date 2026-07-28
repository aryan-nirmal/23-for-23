import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EmailDetailClient } from "@/components/email-detail-client";
import { getAvailableSlots, getEmailById } from "@/lib/store";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EmailDetailPage({ params }: Props) {
  const { id } = await params;
  const email = getEmailById(id);

  if (!email) {
    notFound();
  }

  const availableSlots = getAvailableSlots(email.intent.durationMinutes, 8);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-800 px-6 py-4">
        <Link
          href="/inbox"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inbox
        </Link>
        <h1 className="text-lg font-semibold text-zinc-100">{email.subject}</h1>
        <p className="text-sm text-zinc-500">
          {email.fromName} · {email.from}
        </p>
      </header>

      <EmailDetailClient email={email} availableSlots={availableSlots} />
    </div>
  );
}