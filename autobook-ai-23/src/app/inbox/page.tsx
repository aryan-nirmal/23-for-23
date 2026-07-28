import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bot, Inbox as InboxIcon } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { getEmails } from "@/lib/store";

export default function InboxPage() {
  const emails = getEmails();
  const newCount = emails.filter((e) => e.status === "new").length;

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100">Inbox</h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              {emails.length} emails · {newCount} with booking intent detected
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300">
            <Bot className="h-3.5 w-3.5" />
            AI scanning active
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-zinc-500">
            <InboxIcon className="h-10 w-10" />
            <p>No booking emails found</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-800/80">
            {emails.map((email) => (
              <li key={email.id}>
                <Link
                  href={`/inbox/${email.id}`}
                  className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-zinc-900/60"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-zinc-300">
                    {email.fromName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-200">
                            {email.fromName}
                          </span>
                          {email.status === "new" && (
                            <span className="h-2 w-2 rounded-full bg-violet-500" />
                          )}
                        </div>
                        <p className="truncate text-sm text-zinc-300">
                          {email.subject}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className="text-xs text-zinc-500">
                          {formatDistanceToNow(new Date(email.receivedAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <StatusBadge status={email.status} />
                      </div>
                    </div>

                    <p className="mt-1 truncate text-xs text-zinc-500">
                      {email.intent.summary}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
                        {email.intent.durationMinutes} min
                      </span>
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
                        {Math.round(email.intent.confidence * 100)}% confidence
                      </span>
                      <span className="rounded bg-violet-500/15 px-1.5 py-0.5 text-xs text-violet-400">
                        {email.intent.meetingType}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}