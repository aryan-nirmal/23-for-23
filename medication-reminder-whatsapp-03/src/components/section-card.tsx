import type { ReactNode } from "react";

export function SectionCard({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="glass-card rounded-[32px] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="display text-3xl leading-none">{title}</h2>
          {subtitle ? <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
