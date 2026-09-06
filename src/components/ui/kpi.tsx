import { cn } from "@/lib/utils";

export function Kpi({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-elevated/60 px-4 py-3", className)}>
      <p className="text-xs font-medium uppercase tracking-wider text-subtle">{label}</p>
      <p className="mt-1 font-display text-2xl tabular-nums tracking-tight text-fg">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
