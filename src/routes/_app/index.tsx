import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getOpsHome } from "@/lib/roshoi/server/api";
import { formatINR } from "@/lib/roshoi/money";
import { PageHeader, ErrorBanner } from "@/components/ui/page";
import { Kpi } from "@/components/ui/kpi";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { useCan, useT } from "@/components/session";

export const Route = createFileRoute("/_app/")({ component: HomePage });

function HomePage() {
  const tr = useT();
  const can = useCan();
  const showExecutive = can("view_executive");
  const showFinance = can("view_finance");
  const q = useQuery({
    queryKey: ["ops-home"],
    queryFn: async () => {
      const r = await getOpsHome();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const dash = (v: number | undefined) => (q.isPending ? "…" : String(v ?? "—"));

  return (
    <div>
      <PageHeader
        title={tr("nav.home")}
        description="What is happening, what is wrong, what needs action, and whether today is making money."
        actions={
          showExecutive ? (
            <Link to="/ceo" className="inline-flex h-10 items-center rounded-sm bg-accent px-4 text-sm font-medium text-accent-fg">
              Open Command Center
            </Link>
          ) : null
        }
      />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <p className="mb-4 text-xs text-subtle">{q.data?.period ?? "Today"} · {tr("sim.short")}</p>
      <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-subtle">{tr("home.happening")}</h2>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Orders today" value={dash(q.data?.today?.orders)} />
        <Kpi label="Unassigned" value={dash(q.data?.today?.unassigned)} />
        <Kpi label="Riders online" value={dash(q.data?.today?.online_riders)} />
        <Kpi label="Open tickets" value={dash(q.data?.today?.open_tickets)} />
      </div>
      <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-subtle">{tr("home.wrong")}</h2>
      <div className="mb-8 space-y-2">
        {(q.data?.alerts ?? []).length === 0 && !q.isPending ? <p className="text-sm text-muted">No open alerts.</p> : null}
        {(q.data?.alerts ?? []).map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2">
            <p className="text-sm">{a.message}</p>
            <Badge tone={statusTone(a.severity)}>{a.severity}</Badge>
          </div>
        ))}
      </div>
      <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-subtle">{tr("home.action")}</h2>
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <QueueCard title="Support" to="/support" rows={(q.data?.queue.tickets ?? []).map((r) => ({ id: r.id, label: r.subject, meta: r.priority }))} />
        <QueueCard title="Restaurant onboarding" to="/restaurants" rows={(q.data?.queue.onboarding ?? []).map((r) => ({ id: r.id, label: r.name, meta: r.status }))} />
        <QueueCard title="KYC" to="/kyc" rows={(q.data?.queue.kyc ?? []).map((r) => ({ id: r.id, label: `${r.subject_type} ${r.subject_id}`, meta: r.status }))} />
        <QueueCard title="Settlements" to="/finance" rows={(q.data?.queue.settlements ?? []).map((r) => ({ id: r.id, label: `${r.party_type} ${r.party_id}`, meta: r.status }))} />
        <QueueCard title="Risk" to="/risk" rows={(q.data?.queue.risk ?? []).map((r) => ({ id: r.id, label: r.signal_type, meta: String(r.score) }))} />
        <QueueCard title="Dispatch" to="/dispatch" rows={(q.data?.queue.dispatch ?? []).map((r) => ({ id: r.id, label: r.id, meta: r.status }))} />
      </div>
      {showFinance ? (
        <>
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-subtle">{tr("home.money")}</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="GMV today" value={q.data?.kpis ? formatINR(q.data.kpis.gmvPaise) : dash(undefined)} />
            <Kpi label="Platform revenue" value={q.data?.kpis ? formatINR(q.data.kpis.revenuePaise) : dash(undefined)} />
            <Kpi label="Contribution" value={q.data?.kpis ? formatINR(q.data.kpis.contributionPaise) : dash(undefined)} hint="After variable costs. Simulated." />
            <Kpi label="Refunds" value={q.data?.kpis ? formatINR(q.data.kpis.refundsPaise) : dash(undefined)} />
          </div>
        </>
      ) : null}
    </div>
  );
}

function QueueCard({ title, to, rows }: { title: string; to: string; rows: { id: string; label: string; meta: string }[] }) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <Link to={to as "/"} className="text-xs text-muted underline">
          Open
        </Link>
      </div>
      {rows.length === 0 ? <p className="text-sm text-muted">Queue is clear.</p> : null}
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate">{r.label}</span>
            <Badge>{r.meta}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
