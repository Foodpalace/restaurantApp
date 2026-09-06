import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getFinance, mutateSettlement } from "@/lib/roshoi/server/api";
import { formatINR } from "@/lib/roshoi/money";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Kpi } from "@/components/ui/kpi";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCan } from "@/components/session";

export const Route = createFileRoute("/_app/finance")({ component: () => <RequirePerm perm="view_finance"><FinancePage /></RequirePerm> });

function FinancePage() {
  const can = useCan();
  const canExport = can("export_data");
  const canSettle = can("manage_settlements");

  const [reason, setReason] = useState("");
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["finance"],
    queryFn: async () => {
      const r = await getFinance({ data: { range: "today" } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const mut = useMutation({
    mutationFn: async (input: { id: string; version: number; action: "flag" | "approve"; reason: string }) => {
      const r = await mutateSettlement({ data: input });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Settlement updated");
      void qc.invalidateQueries({ queryKey: ["finance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const m = q.data?.money;
  function exportCsv() {
    const rows = q.data?.settlements ?? [];
    const header = "id,party,status,gmv,commission,payout";
    const body = rows.map((s) => [s.id, s.party_name, s.status, s.gmv_paise, s.commission_paise, s.payout_paise].join(",")).join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "roshoi-settlements.csv";
    a.click();
  }
  return (
    <div>
      <PageHeader
        title="Finance"
        description="Integer paise. Historical lines are not rewritten — only status/flag changes."
        actions={
          canExport ? (
            <Button variant="secondary" onClick={exportCsv}>
              Export CSV
            </Button>
          ) : null
        }
      />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <p className="mb-3 text-xs text-subtle">{q.data?.period} · SIMULATED DATA</p>
      {m ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="GMV" value={formatINR(m.gmvPaise)} />
          <Kpi label="Platform revenue" value={formatINR(m.revenuePaise)} />
          <Kpi label="Refunds" value={formatINR(m.refundsPaise)} />
          <Kpi label="Contribution" value={formatINR(m.contributionPaise)} />
        </div>
      ) : null}
      <Input className="mb-3 max-w-sm" placeholder="Reason for settlement action" value={reason} onChange={(e) => setReason(e.target.value)} />
      <TableWrap>
        <thead>
          <tr>
            <Th>Party</Th>
            <Th>Type</Th>
            <Th>GMV</Th>
            <Th>Commission</Th>
            <Th>Payout</Th>
            <Th>Status</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {(q.data?.settlements ?? []).map((s) => (
            <tr key={String(s.id)}>
              <Td>{String(s.party_name)}</Td>
              <Td>{String(s.party_type)}</Td>
              <Td className="tabular-nums">{formatINR(Number(s.gmv_paise))}</Td>
              <Td className="tabular-nums">{formatINR(Number(s.commission_paise))}</Td>
              <Td className="tabular-nums">{formatINR(Number(s.payout_paise))}</Td>
              <Td>
                <Badge tone={statusTone(String(s.status))}>{String(s.status)}</Badge>
              </Td>
              <Td>
                {canSettle ? (
                  <div className="flex gap-1">
                    <Button size="sm" variant="secondary" onClick={() => mut.mutate({ id: String(s.id), version: Number(s.version), action: "flag", reason })}>
                      Flag
                    </Button>
                    <Button size="sm" onClick={() => mut.mutate({ id: String(s.id), version: Number(s.version), action: "approve", reason })}>
                      Approve
                    </Button>
                  </div>
                ) : null}
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}
