import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAnalytics } from "@/lib/roshoi/server/api";
import { formatINR } from "@/lib/roshoi/money";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { Kpi } from "@/components/ui/kpi";

export const Route = createFileRoute("/_app/analytics")({ component: () => <RequirePerm perm="view_analytics"><AnalyticsPage /></RequirePerm> });

function AnalyticsPage() {
  const [range, setRange] = useState<"today" | "7d" | "30d">("7d");
  const q = useQuery({
    queryKey: ["analytics", range],
    queryFn: async () => {
      const r = await getAnalytics({ data: { range } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  return (
    <div>
      <PageHeader title="Analytics" description="Restaurant, rider, and customer aggregates. Rankings use observed orders — no hidden score." />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <select className="mb-4 h-10 rounded-sm border border-border bg-elevated px-2 text-sm" value={range} onChange={(e) => setRange(e.target.value as typeof range)}>
        <option value="today">Today</option>
        <option value="7d">7 days</option>
        <option value="30d">30 days</option>
      </select>
      <p className="mb-3 text-xs text-subtle">{q.data?.period} · SIMULATED DATA</p>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {(q.data?.customers ?? []).map((c) => (
          <Kpi key={c.status} label={`Customers ${c.status}`} value={String(c.n)} />
        ))}
      </div>
      <TableWrap>
        <thead>
          <tr>
            <Th>Restaurant</Th>
            <Th>Orders</Th>
            <Th>GMV</Th>
            <Th>Cancels</Th>
          </tr>
        </thead>
        <tbody>
          {(q.data?.restaurants ?? []).map((r) => (
            <tr key={r.id}>
              <Td>{r.name}</Td>
              <Td>{r.orders}</Td>
              <Td className="tabular-nums">{formatINR(r.gmv)}</Td>
              <Td>{r.cancels}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}
