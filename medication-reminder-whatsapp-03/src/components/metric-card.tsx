export function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <article className="glass-card rounded-[28px] p-5">
      <p className="eyebrow" style={{ color: accent ?? "var(--accent)" }}>
        {label}
      </p>
      <p className="mt-4 text-3xl font-extrabold tracking-tight">{value}</p>
    </article>
  );
}
