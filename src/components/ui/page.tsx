import { useCan } from "@/components/session";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-fg md:text-3xl">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <p className="text-sm font-medium text-fg">{title}</p>
      {body ? <p className="mt-1 text-sm text-muted">{body}</p> : null}
    </div>
  );
}

export function Denied() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="font-display text-2xl">You do not have access</h1>
      <p className="mt-2 text-sm text-muted">This area is limited to employees with the required permission.</p>
    </div>
  );
}

export function RequirePerm({
  perm,
  anyOf,
  children,
}: {
  perm?: string;
  anyOf?: string[];
  children: React.ReactNode;
}) {
  const can = useCan();
  const allowed = perm ? can(perm) : (anyOf ?? []).some((p) => can(p));
  if (!allowed) return <Denied />;
  return <>{children}</>;
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-fg">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="shrink-0 text-xs underline" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
