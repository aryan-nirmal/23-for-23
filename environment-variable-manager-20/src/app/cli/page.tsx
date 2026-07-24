"use client";

import { AppShell } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import type { PullToken } from "@/lib/types";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";

export default function CliPage() {
  const [tokens, setTokens] = useState<PullToken[]>([]);

  useEffect(() => {
    fetch("/api/tokens")
      .then((res) => res.json())
      .then(setTokens);
  }, []);

  const exampleProject = "proj_web_app";
  const exampleEnv = "production";
  const exampleToken = tokens.find(
    (t) => t.projectId === exampleProject && t.env === exampleEnv
  )?.token ?? "YOUR_TOKEN";

  const pullCommand = `npx envpull --project=${exampleProject} --env=${exampleEnv}`;
  const curlCommand = `curl "http://localhost:3000/api/pull?project=${exampleProject}&env=${exampleEnv}&token=${exampleToken}"`;

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
          <Terminal className="h-6 w-6 text-emerald-400" />
          CLI Integration
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Pull environment variables into your local machine
        </p>
      </div>

      <div className="space-y-8 max-w-3xl">
        <section>
          <h2 className="text-lg font-medium text-zinc-200 mb-3">Quick Start</h2>
          <p className="text-sm text-zinc-500 mb-4">
            Use the <code className="text-emerald-400 font-mono text-xs">envpull</code> CLI
            to download environment variables and write them to your local{" "}
            <code className="text-zinc-400 font-mono text-xs">.env</code> file.
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
              <span className="text-xs text-zinc-500">Pull command</span>
              <CopyButton text={pullCommand} />
            </div>
            <pre className="p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
              <span className="text-zinc-500">$</span> {pullCommand}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-200 mb-3">API Endpoint</h2>
          <p className="text-sm text-zinc-500 mb-4">
            The CLI uses the pull API under the hood. You can also call it directly:
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
              <span className="text-xs text-zinc-500">GET /api/pull</span>
              <CopyButton text={curlCommand} />
            </div>
            <pre className="p-4 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap break-all">
              {curlCommand}
            </pre>
          </div>
          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="text-sm font-medium text-zinc-300 mb-2">Parameters</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-4">
                <dt className="font-mono text-emerald-400 w-20 shrink-0">project</dt>
                <dd className="text-zinc-500">Project ID (e.g. proj_web_app)</dd>
              </div>
              <div className="flex gap-4">
                <dt className="font-mono text-emerald-400 w-20 shrink-0">env</dt>
                <dd className="text-zinc-500">Environment: dev, staging, or production</dd>
              </div>
              <div className="flex gap-4">
                <dt className="font-mono text-emerald-400 w-20 shrink-0">token</dt>
                <dd className="text-zinc-500">Project-scoped access token</dd>
              </div>
            </dl>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-200 mb-3">Available Tokens</h2>
          <p className="text-sm text-zinc-500 mb-4">
            Pre-configured tokens for demo projects (in-memory store):
          </p>
          <div className="rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800">
            {tokens.map((t) => (
              <div
                key={t.token}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors"
              >
                <div>
                  <p className="text-sm text-zinc-300">{t.label}</p>
                  <p className="text-xs text-zinc-600 font-mono mt-0.5">
                    {t.projectId} / {t.env}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-zinc-500 truncate max-w-xs">
                    {t.token}
                  </code>
                  <CopyButton text={t.token} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-200 mb-3">Response Format</h2>
          <p className="text-sm text-zinc-500 mb-4">
            Returns plain text in standard <code className="font-mono text-xs text-zinc-400">.env</code> format:
          </p>
          <pre className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 font-mono text-xs text-zinc-400 overflow-x-auto">
{`DATABASE_URL=postgres://prod.db.acme.dev:5432/webapp
NEXT_PUBLIC_API_URL=https://api.acme.dev
STRIPE_SECRET_KEY=sk_live_51HxYzKqLmNpQrStUvWxYz
JWT_SECRET=prod_jwt_super_secret_key_2026`}
          </pre>
        </section>
      </div>
    </AppShell>
  );
}