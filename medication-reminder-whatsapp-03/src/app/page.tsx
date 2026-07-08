export default function Home() {
  return (
    <main className="app-shell relative min-h-screen overflow-hidden px-6 py-8 md:px-10">
      <div className="hero-veil" />
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="glass-card flex items-center justify-between rounded-[28px] px-6 py-4">
          <div>
            <p className="eyebrow text-[var(--accent)]">PulsePrompt</p>
            <p className="text-sm text-[var(--muted)]">
              Medication reminders, caregiver visibility, WhatsApp-native calm.
            </p>
          </div>
          <a
            href="/login"
            className="rounded-full border border-[var(--foreground)]/12 bg-[var(--foreground)] px-5 py-2 text-sm font-semibold text-[var(--background)] transition hover:translate-y-[-1px]"
          >
            Open the MVP
          </a>
        </header>

        <section className="section-grid items-stretch">
          <div className="glass-card relative overflow-hidden rounded-[40px] px-7 py-8 md:px-10 md:py-12">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <p className="eyebrow mb-4 text-[var(--accent)]">Project 03 / Caregiving Infrastructure</p>
            <h1 className="display max-w-4xl text-5xl leading-[0.9] md:text-7xl">
              Turn missed pills into a visible, traceable conversation.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              PulsePrompt gives caregivers a way to onboard patients, schedule daily doses, simulate
              WhatsApp reminders, catch missed confirmations, and review weekly adherence trends
              without paying for a real messaging provider on day one.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/dashboard"
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white transition hover:translate-y-[-1px]"
              >
                Explore demo dashboard
              </a>
              <a
                href="#capabilities"
                className="rounded-full border border-[var(--foreground)]/12 px-6 py-3 text-sm font-semibold"
              >
                See capabilities
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <article className="glass-card rounded-[32px] p-6">
              <p className="eyebrow text-[var(--accent-2)]">Core loop</p>
              <div className="mt-4 space-y-4">
                {[
                  "Schedule medication times per patient",
                  "Send mock WhatsApp reminders and capture replies",
                  "Escalate missed doses after the grace window",
                  "Generate weekly adherence summaries",
                ].map((line, index) => (
                  <div key={line} className="flex gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--foreground)] text-sm font-bold text-[var(--background)]">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-[var(--muted)]">{line}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-card rounded-[32px] p-6">
              <p className="eyebrow text-[var(--accent)]">What is real in v1</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <li>Caregiver dashboard and patient onboarding</li>
                <li>Medication schedules, event logs, and consent records</li>
                <li>Job endpoints for reminder, escalation, and summary processing</li>
                <li>Supabase-ready schema with demo-mode local runtime</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="capabilities" className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Onboard families fast",
              copy: "Register caregiver and patient details, store consent events, and keep phone numbers first-class for later provider upgrades.",
            },
            {
              title: "Simulate the WhatsApp layer",
              copy: "Use the built-in simulator and mock webhook endpoints to test reminders, replies, snoozes, failures, and escalation timing.",
            },
            {
              title: "Stay audit-ready",
              copy: "Every event leaves a message log trail with immutable payloads, making dispute review and support work straightforward.",
            },
          ].map((item) => (
            <article key={item.title} className="glass-card rounded-[30px] p-6">
              <h2 className="display text-3xl leading-tight">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.copy}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
