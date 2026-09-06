import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getOrder, getOrders, mutateOrder } from "@/lib/roshoi/server/api";
import { formatINR } from "@/lib/roshoi/money";
import { ORDER_STATUSES } from "@/lib/roshoi/types";
import { newId } from "@/lib/roshoi/ids";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCan } from "@/components/session";

export const Route = createFileRoute("/_app/orders")({ component: () => <RequirePerm perm="view_orders"><OrdersPage /></RequirePerm> });

function OrdersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const list = useQuery({
    queryKey: ["orders", q, status],
    queryFn: async () => {
      const r = await getOrders({ data: { q, status, page: 0 } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  return (
    <div>
      <PageHeader title="Orders" description="Search, inspect timeline, and take permitted actions. Refunds are real writes on this database — never silent." />
      {list.error ? <ErrorBanner message={list.error.message} onRetry={() => void list.refetch()} /> : null}
      <div className="mb-4 flex flex-wrap gap-2">
        <Input placeholder="Order, customer, restaurant, rider" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <select className="h-10 rounded-sm border border-border bg-elevated px-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <TableWrap>
        <thead>
          <tr>
            <Th>Order</Th>
            <Th>Customer</Th>
            <Th>Restaurant</Th>
            <Th>Status</Th>
            <Th>Value</Th>
            <Th>Placed</Th>
          </tr>
        </thead>
        <tbody>
          {(list.data?.rows ?? []).map((row) => (
            <tr key={row.id} className="cursor-pointer hover:bg-elevated/50" onClick={() => setOpenId(row.id)}>
              <Td className="font-mono text-xs">{row.id}</Td>
              <Td>{row.customer_name}</Td>
              <Td>{row.restaurant_name}</Td>
              <Td>
                <Badge tone={statusTone(row.status)}>{row.status}</Badge>
              </Td>
              <Td className="tabular-nums">{formatINR(row.order_value_paise)}</Td>
              <Td className="text-muted">{String(row.placed_at).slice(0, 16)}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      <Dialog open={!!openId} onOpenChange={() => setOpenId(null)}>
        <DialogContent>{openId ? <OrderDetail id={openId} onClose={() => setOpenId(null)} /> : null}</DialogContent>
      </Dialog>
    </div>
  );
}

function OrderDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const can = useCan();
  const canCancel = can("cancel_orders");
  const canManage = can("manage_orders");
  const canRefund = can("refund_orders");
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const r = await getOrder({ data: { id } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const mut = useMutation({
    mutationFn: async (payload: Parameters<typeof mutateOrder>[0]["data"]) => {
      const r = await mutateOrder({ data: payload });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
    onSuccess: () => {
      toast.success("Order updated");
      void qc.invalidateQueries();
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const o = q.data?.order;
  if (!o) return <p className="text-sm text-muted">Loading order…</p>;
  const version = Number(o.version);
  const remaining = Number(o.order_value_paise) - Number(o.refunded_paise);
  return (
    <div>
      <DialogTitle>{String(o.id)}</DialogTitle>
      <p className="mt-1 text-sm text-muted">
        {String(o.customer_name)} · {String(o.restaurant_name)} · {o.rider_name ? String(o.rider_name) : "No rider"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone={statusTone(String(o.status))}>{String(o.status)}</Badge>
        <Badge>{String(o.payment_status)}</Badge>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>Items {formatINR(Number(o.order_value_paise))}</div>
        <div>Restaurant discount {formatINR(Number(o.restaurant_discount_paise))}</div>
        <div>Platform discount {formatINR(Number(o.platform_discount_paise))}</div>
        <div>Commission {formatINR(Number(o.commission_paise))}</div>
        <div>Payment fee {formatINR(Number(o.payment_fee_paise))}</div>
        <div>Tax (pass-through) {formatINR(Number(o.tax_paise))}</div>
        <div className="col-span-2 font-medium">Restaurant settlement {formatINR(Number(o.restaurant_settlement_paise))}</div>
      </dl>
      <h3 className="mt-4 text-xs uppercase tracking-wider text-subtle">Timeline</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {(q.data?.events ?? []).map((ev) => (
          <li key={ev.id} className="text-muted">
            {String(ev.at).slice(11, 19)} · {ev.actor_type} · {ev.from_status ?? "—"} → {ev.to_status} {ev.reason ? `· ${ev.reason}` : ""}
          </li>
        ))}
      </ul>
      <label className="mt-4 block text-xs text-muted">
        Reason (required for changes)
        <Input className="mt-1" value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        {canCancel ? (
          <Button variant="danger" disabled={mut.isPending} onClick={() => mut.mutate({ id, version, action: "cancel", reason, idempotencyKey: newId("idm") })}>
            Cancel
          </Button>
        ) : null}
        {canManage ? (
          <Button variant="secondary" disabled={mut.isPending} onClick={() => mut.mutate({ id, version, action: "transition", toStatus: "CONFIRMED", reason, idempotencyKey: newId("idm") })}>
            Confirm
          </Button>
        ) : null}
      </div>
      {canRefund ? (
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <label className="text-xs text-muted">
            Refund paise (max {remaining})
            <Input className="mt-1" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <Button
            variant="outline"
            disabled={mut.isPending}
            onClick={() =>
              mut.mutate({
                id,
                version,
                action: "refund",
                amountPaise: Number(amount),
                reason,
                idempotencyKey: newId("idm"),
              })
            }
          >
            Issue refund
          </Button>
        </div>
      ) : null}
    </div>
  );
}
