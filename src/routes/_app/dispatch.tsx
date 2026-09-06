import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getDispatch, getOrder, mutateOrder } from "@/lib/roshoi/server/api";
import { newId } from "@/lib/roshoi/ids";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, statusTone } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/dispatch")({ component: () => <RequirePerm perm="manage_dispatch"><DispatchPage /></RequirePerm> });

function DispatchPage() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["dispatch"],
    queryFn: async () => {
      const r = await getDispatch();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const [reason, setReason] = useState("");
  const [riderId, setRiderId] = useState("");
  const mut = useMutation({
    mutationFn: async (orderId: string) => {
      const detail = await getOrder({ data: { id: orderId } });
      if (!detail.ok) throw new Error(detail.error);
      const r = await mutateOrder({
        data: {
          id: orderId,
          version: Number(detail.data.order.version),
          action: "reassign",
          riderId,
          reason,
          idempotencyKey: newId("idm"),
        },
      });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
    onSuccess: () => {
      toast.success("Rider assigned");
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="Dispatch" description="Assign ready orders. Manual override always needs a reason and writes an audit event." />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-muted">
          Reason
          <Input className="mt-1" value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <label className="text-xs text-muted">
          Rider
          <select className="mt-1 h-10 w-full rounded-sm border border-border bg-elevated px-2 text-sm" value={riderId} onChange={(e) => setRiderId(e.target.value)}>
            <option value="">Select available rider</option>
            {(q.data?.available ?? []).map((r) => (
              <option key={String(r.id)} value={String(r.id)}>
                {String(r.name)} · {String(r.zone_code)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-3 text-base">Unassigned</CardTitle>
          <ul className="space-y-2">
            {(q.data?.unassigned ?? []).map((o) => (
              <li key={String(o.id)} className="flex items-center justify-between gap-2 text-sm">
                <span>
                  {String(o.id)} · {String(o.restaurant_name)}
                  <Badge className="ml-2" tone={statusTone(String(o.status))}>
                    {String(o.status)}
                  </Badge>
                </span>
                <Button size="sm" disabled={mut.isPending} onClick={() => mut.mutate(String(o.id))}>
                  Assign
                </Button>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle className="mb-3 text-base">Active deliveries</CardTitle>
          <ul className="space-y-2 text-sm">
            {(q.data?.assigned ?? []).map((o) => (
              <li key={String(o.id)}>
                {String(o.id)} · {String(o.rider_name)} · {String(o.status)}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
