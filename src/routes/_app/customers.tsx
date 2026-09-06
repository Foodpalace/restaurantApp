import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getCustomers, mutateCustomer } from "@/lib/roshoi/server/api";
import { formatINR } from "@/lib/roshoi/money";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { useCan } from "@/components/session";

export const Route = createFileRoute("/_app/customers")({ component: () => <RequirePerm perm="view_customers"><CustomersPage /></RequirePerm> });

function CustomersPage() {
  const can = useCan();
  const canManage = can("manage_customers");
  const [q, setQ] = useState("");
  const [reason, setReason] = useState("");
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["customers", q],
    queryFn: async () => {
      const r = await getCustomers({ data: { q } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const mut = useMutation({
    mutationFn: async (input: Parameters<typeof mutateCustomer>[0]["data"]) => {
      const r = await mutateCustomer({ data: input });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Customer updated");
      void qc.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="Customers" description="Minimised personal data. Phones and emails are masked unless a future Shared Core policy expands access." />
      {list.error ? <ErrorBanner message={list.error.message} onRetry={() => void list.refetch()} /> : null}
      <div className="mb-4 flex flex-wrap gap-2">
        <Input placeholder="Search customers" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <Input placeholder="Reason for status change" value={reason} onChange={(e) => setReason(e.target.value)} className="max-w-sm" />
      </div>
      <TableWrap>
        <thead>
          <tr>
            <Th>Customer</Th>
            <Th>Status</Th>
            <Th>Zone</Th>
            <Th>Orders</Th>
            <Th>Lifetime GMV</Th>
            <Th>Risk</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {(list.data?.rows ?? []).map((c) => (
            <tr key={String(c.id)}>
              <Td>
                {String(c.display_name)}
                <div className="text-xs text-muted">{String(c.phone_masked)} · {String(c.email_masked)}</div>
              </Td>
              <Td>
                <Badge tone={statusTone(String(c.status))}>{String(c.status)}</Badge>
              </Td>
              <Td>{String(c.zone_code)}</Td>
              <Td>{String(c.order_count)}</Td>
              <Td className="tabular-nums">{formatINR(Number(c.lifetime_gmv_paise))}</Td>
              <Td>{String(c.risk_score)}</Td>
              <Td>
                {canManage ? (
                  <Button size="sm" variant="danger" onClick={() => mut.mutate({ id: String(c.id), status: "SUSPENDED", reason })}>
                    Suspend
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
