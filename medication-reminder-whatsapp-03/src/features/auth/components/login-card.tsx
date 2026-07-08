"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginCard({ supabaseEnabled }: { supabaseEnabled: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  async function handleDemoLogin(formData: FormData) {
    const payload = {
      ownerName: String(formData.get("ownerName") || ""),
      email: String(formData.get("email") || ""),
      accountType: String(formData.get("accountType") || "family"),
    };

    const response = await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Could not start the demo session.");
      return;
    }

    startTransition(() => {
      router.push("/dashboard");
      router.refresh();
    });
  }

  async function handleMagicLink(email: string) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase env vars are missing, so magic links are disabled in this workspace.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setMessage(error ? error.message : "Magic link sent. Check your inbox to continue.");
  }

  return (
    <div className="glass-card mx-auto w-full max-w-3xl rounded-[36px] p-7 md:p-10">
      <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow text-[var(--accent)]">Caregiver entry</p>
          <h1 className="display mt-4 text-5xl leading-none">Start a calm, testable reminder workflow.</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)]">
            The app ships with demo auth so you can explore the full MVP right away. If you add
            Supabase env vars, the same screen can send real magic links.
          </p>
          <ul className="mt-8 space-y-3 text-sm leading-6 text-[var(--muted)]">
            <li>One operator account can manage many patients.</li>
            <li>Consent, reminders, replies, and escalations all leave an audit trail.</li>
            <li>Mock WhatsApp delivery keeps the MVP free to run locally.</li>
          </ul>
        </div>

        <div className="rounded-[28px] border border-[var(--foreground)]/10 bg-white/60 p-5">
          <form
            action={async (formData) => {
              await handleDemoLogin(formData);
            }}
            className="space-y-4"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Operator name</span>
              <input
                name="ownerName"
                defaultValue="Rahul Sharma"
                required
                className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3 outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Email</span>
              <input
                name="email"
                type="email"
                defaultValue="rahul@pulseprompt.app"
                required
                className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3 outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Account type</span>
              <select
                name="accountType"
                defaultValue="family"
                className="w-full rounded-2xl border border-[var(--foreground)]/12 bg-white px-4 py-3 outline-none"
              >
                <option value="family">Family</option>
                <option value="clinic">Clinic</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-bold text-[var(--background)] transition hover:translate-y-[-1px] disabled:opacity-60"
            >
              {isPending ? "Opening demo..." : "Enter demo workspace"}
            </button>
          </form>

          <div className="mt-4 rounded-[24px] border border-[var(--foreground)]/10 bg-[var(--card)] p-4">
            <p className="text-sm font-semibold">Optional magic-link mode</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {supabaseEnabled
                ? "Supabase is configured. You can send a real login link to the email above."
                : "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable real email login."}
            </p>
            <button
              type="button"
              onClick={() => handleMagicLink("rahul@pulseprompt.app")}
              className="mt-4 rounded-full border border-[var(--foreground)]/12 px-4 py-2 text-sm font-semibold"
            >
              Send test magic link
            </button>
          </div>

          {message ? <p className="mt-4 text-sm text-[var(--muted)]">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
