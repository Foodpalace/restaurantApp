import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getRestaurants, mutateRestaurant } from "@/lib/roshoi/server/api";
import { formatINR } from "@/lib/roshoi/money";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { useCan } from "@/components/session";

export const Route = createFileRoute("/_app/restaurants")({ component: () => <RequirePerm perm="view_restaurants"><RestaurantsPage /></RequirePerm> });

function RestaurantsPage() {
  const can = useCan();
  const canAct = can("manage_restaurants") || can("approve_restaurants");
  const [q, setQ] = useState("");
  const [reason, setReason] = useState("");
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["restaurants", q],
    queryFn: async () => {
      const r = await getRestaurants({ data: { q } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const mut = useMutation({
    mutationFn: async (input: Parameters<typeof mutateRestaurant>[0]["data"]) => {
      const r = await mutateRestaurant({ data: input });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Restaurant updated");
      void qc.invalidateQueries({ queryKey: ["restaurants"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="Restaurants" description="Onboarding, verification, commission, and operational status. Missing documents stay visible until they are actually supplied." />
      {list.error ? <ErrorBanner message={list.error.message} onRetry={() => void list.refetch()} /> : null}
      <div className="mb-4 flex flex-wrap gap-2">
        <Input placeholder="Search restaurants" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <Input placeholder="Reason for change" value={reason} onChange={(e) => setReason(e.target.value)} className="max-w-sm" />
      </div>
      <TableWrap>
        <thead>
          <tr>
            <Th>Restaurant</Th>
            <Th>Status</Th>
            <Th>KYC</Th>
            <Th>Zone</Th>
            <Th>GMV</Th>
            <Th>Commission</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {(list.data?.rows ?? []).map((r) => (
            <tr key={String(r.id)}>
              <Td>
                <div className="font-medium">{String(r.name)}</div>
                <div className="text-xs text-muted">{String(r.cuisine)} · {String(r.onboarding_step)}</div>
                {String(r.missing_documents) ? <div className="text-xs text-warn">Missing: {String(r.missing_documents)}</div> : null}
              </Td>
              <Td>
                <Badge tone={statusTone(String(r.status))}>{String(r.status)}</Badge>
              </Td>
              <Td>{String(r.kyc_status)}</Td>
              <Td>{String(r.zone_code)}</Td>
              <Td className="tabular-nums">{formatINR(Number(r.gmv_paise))}</Td>
              <Td className="tabular-nums">{(Number(r.commission_bps) / 100).toFixed(2)}%</Td>
              <Td>
                {canAct ? (
                  <div className="flex flex-wrap gap-1">
                    {String(r.status) !== "ACTIVE" ? (
                      <Button size="sm" onClick={() => mut.mutate({ id: String(r.id), version: Number(r.version), action: "approve", reason })}>
                        Approve
                      </Button>
                    ) : (
                      <Button size="sm" variant="danger" onClick={() => mut.mutate({ id: String(r.id), version: Number(r.version), action: "status", status: "SUSPENDED", reason })}>
                        Suspend
                      </Button>
                    )}
                    {String(r.status) === "PAUSED" ? null : (
                      <Button size="sm" variant="secondary" onClick={() => mut.mutate({ id: String(r.id), version: Number(r.version), action: "status", status: "PAUSED", reason })}>
                        Pause
                      </Button>
                    )}
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
