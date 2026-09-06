import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getRiders, mutateRider } from "@/lib/roshoi/server/api";
import { formatINR } from "@/lib/roshoi/money";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { useCan } from "@/components/session";

export const Route = createFileRoute("/_app/riders")({ component: () => <RequirePerm perm="view_riders"><RidersPage /></RequirePerm> });

function RidersPage() {
  const can = useCan();
  const canManage = can("manage_riders");
  const [reason, setReason] = useState("");
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const r = await getRiders({ data: {} });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const mut = useMutation({
    mutationFn: async (input: Parameters<typeof mutateRider>[0]["data"]) => {
      const r = await mutateRider({ data: input });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Rider updated");
      void qc.invalidateQueries({ queryKey: ["riders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="Riders" description="Availability, KYC, earnings, and COD balance. AI never auto-punishes a rider." />
      {list.error ? <ErrorBanner message={list.error.message} onRetry={() => void list.refetch()} /> : null}
      <Input className="mb-4 max-w-sm" placeholder="Reason for suspend/restore" value={reason} onChange={(e) => setReason(e.target.value)} />
      <TableWrap>
        <thead>
          <tr>
            <Th>Rider</Th>
            <Th>Status</Th>
            <Th>KYC</Th>
            <Th>Zone</Th>
            <Th>Earnings</Th>
            <Th>COD</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {(list.data?.rows ?? []).map((r) => (
            <tr key={String(r.id)}>
              <Td>
                {String(r.name)}
                <div className="text-xs text-muted">{String(r.vehicle)} · {Number(r.deliveries)} deliveries</div>
              </Td>
              <Td>
                <Badge tone={statusTone(String(r.status))}>{String(r.status)}</Badge>
              </Td>
              <Td>{String(r.kyc_status)}</Td>
              <Td>{String(r.zone_code)}</Td>
              <Td className="tabular-nums">{formatINR(Number(r.earnings_paise))}</Td>
              <Td className="tabular-nums">{formatINR(Number(r.cod_balance_paise))}</Td>
              <Td>
                {canManage ? (
                  <Button size="sm" variant={String(r.status) === "SUSPENDED" ? "secondary" : "danger"} onClick={() => mut.mutate({ id: String(r.id), version: Number(r.version), status: String(r.status) === "SUSPENDED" ? "OFFLINE" : "SUSPENDED", reason })}>
                    {String(r.status) === "SUSPENDED" ? "Restore" : "Suspend"}
                  </Button>
                ) : null}
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}
