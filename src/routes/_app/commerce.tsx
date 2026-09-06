import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getCommerce, mutateCampaign, mutatePromotion } from "@/lib/roshoi/server/api";
import { formatINR } from "@/lib/roshoi/money";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Tabs } from "@/components/ui/tabs";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { useCan } from "@/components/session";

export const Route = createFileRoute("/_app/commerce")({ component: () => <RequirePerm anyOf={["manage_promotions","manage_loyalty","manage_campaigns"]}><CommercePage /></RequirePerm> });

function CommercePage() {
  const can = useCan();
  const canPromo = can("manage_promotions");
  const canCamp = can("manage_campaigns");

  const [tab, setTab] = useState("promos");
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["commerce"],
    queryFn: async () => {
      const r = await getCommerce();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const [name, setName] = useState("New lunch offer");
  const [reason, setReason] = useState("");
  const promoMut = useMutation({
    mutationFn: async () => {
      const r = await mutatePromotion({
        data: {
          name,
          promoType: "percentage",
          funding: "platform",
          budgetPaise: 50_000,
          discountBps: 1000,
          minOrderPaise: 20_000,
          status: "ACTIVE",
          reason,
        },
      });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Promotion saved");
      void qc.invalidateQueries({ queryKey: ["commerce"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const campMut = useMutation({
    mutationFn: async (id: string) => {
      const r = await mutateCampaign({ data: { id, status: "LIVE", reason: reason || "Publish" } });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Campaign published");
      void qc.invalidateQueries({ queryKey: ["commerce"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="Growth" description="Promotions, loyalty, campaigns. Publishing requires a human." />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <Tabs
        tabs={[
          { id: "promos", label: "Promotions" },
          { id: "loyalty", label: "Loyalty" },
          { id: "campaigns", label: "Marketing" },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "promos" ? (
        <div className="mt-4 space-y-4">
          {canPromo ? (
            <div className="flex flex-wrap gap-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-xs" />
              <Input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="max-w-xs" />
              <Button onClick={() => promoMut.mutate()}>Create 10% platform promo</Button>
            </div>
          ) : null}
          <TableWrap>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Funding</Th>
                <Th>Budget</Th>
                <Th>Spent</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {(q.data?.promotions ?? []).map((p) => (
                <tr key={String(p.id)}>
                  <Td>{String(p.name)}</Td>
                  <Td>{String(p.funding)}</Td>
                  <Td className="tabular-nums">{formatINR(Number(p.budget_paise))}</Td>
                  <Td className="tabular-nums">{formatINR(Number(p.spent_paise))}</Td>
                  <Td>
                    <Badge tone={statusTone(String(p.status))}>{String(p.status)}</Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </div>
      ) : null}
      {tab === "loyalty" ? (
        <div className="mt-4 grid gap-3">
          {(q.data?.loyalty ?? []).map((r) => (
            <Card key={String(r.id)}>
              <CardTitle className="text-base">{String(r.name)}</CardTitle>
              <p className="mt-2 text-sm text-muted">
                {String(r.points_per_rupee)} point / rupee · expires in {String(r.expiry_days)} days · {String(r.status)}
              </p>
              <p className="mt-1 text-xs text-subtle">Liability is capped by expiry. Rules are configurable — no unlimited rewards.</p>
            </Card>
          ))}
        </div>
      ) : null}
      {tab === "campaigns" ? (
        <TableWrap>
          <thead>
            <tr>
              <Th>Campaign</Th>
              <Th>Channel</Th>
              <Th>Segment</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {(q.data?.campaigns ?? []).map((c) => (
              <tr key={String(c.id)}>
                <Td>{String(c.name)}</Td>
                <Td>{String(c.channel)}</Td>
                <Td>{String(c.segment)}</Td>
                <Td>
                  <Badge tone={statusTone(String(c.status))}>{String(c.status)}</Badge>
                </Td>
                <Td>
                  {canCamp && String(c.status) !== "LIVE" ? (
                    <Button size="sm" onClick={() => campMut.mutate(String(c.id))}>
                      Publish
                    </Button>
                  ) : null}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      ) : null}
    </div>
  );
}
