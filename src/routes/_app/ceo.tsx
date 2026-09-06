import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  askAssistant,
  generateCeoReport,
  getCeoDashboard,
  runE2eSimulation,
  runMarketplaceTick,
} from "@/lib/roshoi/server/api";
import { formatBps, formatINR } from "@/lib/roshoi/money";
import { computeEconomics, DEFAULT_PILOT_ASSUMPTIONS, simulateCommissionChange } from "@/lib/roshoi/unit-economics";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Kpi } from "@/components/ui/kpi";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/ceo")({ component: () => <RequirePerm perm="view_executive"><CeoPage /></RequirePerm> });

function CeoPage() {
  const [tab, setTab] = useState("today");
  const [range, setRange] = useState<"today" | "yesterday" | "7d" | "30d" | "month">("today");
  const q = useQuery({
    queryKey: ["ceo", range],
    queryFn: async () => {
      const r = await getCeoDashboard({ data: { range } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const qc = useQueryClient();
  const tick = useMutation({
    mutationFn: async () => {
      const r = await runMarketplaceTick();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
    onSuccess: (d) => {
      toast.success(`Simulated order ${d.orderId} delivered`);
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const e2e = useMutation({
    mutationFn: async () => {
      const r = await runE2eSimulation();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
    onSuccess: () => {
      toast.success("End-to-end admin simulation recorded in the audit log");
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Command Center"
        description="Business health first. Simulation does not change a live marketplace."
        actions={
          <>
            <Button variant="secondary" onClick={() => tick.mutate()} disabled={tick.isPending}>
              Simulate one delivery
            </Button>
            <Button variant="outline" onClick={() => e2e.mutate()} disabled={e2e.isPending}>
              Run admin walkthrough
            </Button>
          </>
        }
      />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Tabs
          tabs={[
            { id: "today", label: "Today" },
            { id: "money", label: "Money" },
            { id: "economics", label: "Unit economics" },
            { id: "sim", label: "What-if" },
            { id: "ai", label: "CEO AI" },
            { id: "report", label: "Report" },
          ]}
          value={tab}
          onChange={setTab}
        />
        <select
          className="h-10 rounded-sm border border-border bg-elevated px-2 text-sm"
          value={range}
          onChange={(e) => setRange(e.target.value as typeof range)}
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="7d">7 days</option>
          <option value="30d">30 days</option>
          <option value="month">Month</option>
        </select>
      </div>
      {tab === "today" ? <TodayPane data={q.data} /> : null}
      {tab === "money" ? <MoneyPane data={q.data} /> : null}
      {tab === "economics" ? <EconomicsPane data={q.data} /> : null}
      {tab === "sim" ? <Simulator /> : null}
      {tab === "ai" ? <CeoAi /> : null}
      {tab === "report" ? <ReportPane /> : null}
    </div>
  );
}

function TodayPane({ data }: { data?: {
  period: string;
  money: { orders: number; gmvPaise: number; contributionPaise: number; aovPaise: number; deliverySuccessBps: number };
  prior: { orders: number };
  counts: { restaurants: number; riders: number; customers: number; online: number };
  top: Array<{ id: string; name: string; gmv: number; orders: number }>;
  weak: Array<{ id: string; name: string; gmv: number }>;
} }) {
  if (!data) return <p className="text-sm text-muted">Loading…</p>;
  return (
    <div className="space-y-6">
      <p className="text-xs text-subtle">{data.period} · SIMULATED DATA</p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Orders" value={String(data.money.orders)} hint={`Yesterday ${data.prior.orders}`} />
        <Kpi label="GMV" value={formatINR(data.money.gmvPaise)} />
        <Kpi label="Contribution" value={formatINR(data.money.contributionPaise)} />
        <Kpi label="AOV" value={formatINR(data.money.aovPaise)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Active restaurants" value={String(data.counts.restaurants)} />
        <Kpi label="Riders" value={String(data.counts.riders)} hint={`${data.counts.online} online`} />
        <Kpi label="Active customers" value={String(data.counts.customers)} />
        <Kpi label="Delivery success" value={formatBps(data.money.deliverySuccessBps)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-3 text-base">Growing restaurants</CardTitle>
          <ul className="space-y-2 text-sm">
            {data.top.map((r) => (
              <li key={r.id} className="flex justify-between">
                <span>{r.name}</span>
                <span className="tabular-nums text-muted">{formatINR(r.gmv)} · {r.orders} orders</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle className="mb-3 text-base">Needs attention</CardTitle>
          <ul className="space-y-2 text-sm">
            {data.weak.map((r) => (
              <li key={r.id} className="flex justify-between">
                <span>{r.name}</span>
                <span className="tabular-nums text-muted">{formatINR(r.gmv)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function MoneyPane({ data }: { data?: { money: { gmvPaise: number; restaurantCommissionPaise: number; deliveryRevenuePaise: number; customerFeesPaise: number; paymentCostPaise: number; riderCostPaise: number; refundsPaise: number; promotionalCostPaise: number; supportCostPaise: number; infraCostPaise: number; contributionPaise: number; revenuePaise: number } } }) {
  if (!data) return <p className="text-sm text-muted">Loading…</p>;
  const m = data.money;
  const rows = [
    ["Restaurant commission", m.restaurantCommissionPaise],
    ["Delivery revenue", m.deliveryRevenuePaise],
    ["Customer fees", m.customerFeesPaise],
    ["Payment cost", -m.paymentCostPaise],
    ["Rider cost", -m.riderCostPaise],
    ["Refunds", -m.refundsPaise],
    ["Platform promotions", -m.promotionalCostPaise],
    ["Support (variable)", -m.supportCostPaise],
    ["Infrastructure (variable)", -m.infraCostPaise],
  ] as const;
  return (
    <Card>
      <CardTitle className="mb-1">Platform contribution</CardTitle>
      <p className="mb-4 text-xs text-muted">SIMULATED DATA. 10% commission is not assumed profitable — this is the actual stack.</p>
      <ul className="space-y-2 text-sm">
        {rows.map(([label, v]) => (
          <li key={label} className="flex justify-between border-b border-border py-1">
            <span className="text-muted">{label}</span>
            <span className="tabular-nums">{formatINR(v)}</span>
          </li>
        ))}
        <li className="flex justify-between pt-2 font-medium">
          <span>Contribution</span>
          <span className="tabular-nums">{formatINR(m.contributionPaise)}</span>
        </li>
      </ul>
    </Card>
  );
}

function EconomicsPane({ data }: { data?: { unit: { revenuePerOrder: number; contributionPerOrder: number; breakEvenOrdersPerDay: number | null }; money: { orders: number; aovPaise: number } } }) {
  if (!data) return null;
  const slice = computeEconomics({
    ...DEFAULT_PILOT_ASSUMPTIONS,
    orders: Math.max(1, data.money.orders),
    aovPaise: data.money.aovPaise || DEFAULT_PILOT_ASSUMPTIONS.aovPaise,
  });
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <Kpi label="Revenue / order" value={formatINR(data.unit.revenuePerOrder)} />
      <Kpi label="Contribution / order" value={formatINR(data.unit.contributionPerOrder)} />
      <Kpi label="Break-even orders / day" value={data.unit.breakEvenOrdersPerDay == null ? "Not reached" : String(data.unit.breakEvenOrdersPerDay)} />
      <Kpi label="Commission / order" value={formatINR(Math.trunc(slice.restaurantCommissionPaise / Math.max(1, slice.gmvPaise ? data.money.orders || 1 : 1)))} />
      <Kpi label="Rider cost / order" value={formatINR(DEFAULT_PILOT_ASSUMPTIONS.riderPayoutPaise)} />
      <Kpi label="Payment cost / order" value={formatINR(Math.trunc(slice.paymentCostPaise / Math.max(1, data.money.orders || 1)))} />
    </div>
  );
}

function Simulator() {
  const [commissionBps, setCommissionBps] = useState(1000);
  const [orders, setOrders] = useState(48);
  const [aov, setAov] = useState(420);
  const [discount, setDiscount] = useState(12);
  const [delivery, setDelivery] = useState(35);
  const [customerFee, setCustomerFee] = useState(5);
  const [rider, setRider] = useState(42);
  const [refundBps, setRefundBps] = useState(180);
  const [paymentBps, setPaymentBps] = useState(180);
  const [support, setSupport] = useState(2.5);
  const [marketing, setMarketing] = useState(250);
  const input = useMemo(
    () => ({
      ...DEFAULT_PILOT_ASSUMPTIONS,
      commissionBps,
      orders,
      aovPaise: aov * 100,
      platformDiscountPaise: discount * 100,
      deliveryFeePaise: delivery * 100,
      customerFeePaise: customerFee * 100,
      riderPayoutPaise: rider * 100,
      refundRateBps: refundBps,
      paymentCostBps: paymentBps,
      supportCostPaise: Math.round(support * 100),
      marketingSpendPaise: marketing * 100,
    }),
    [commissionBps, orders, aov, discount, delivery, customerFee, rider, refundBps, paymentBps, support, marketing],
  );
  const result = computeEconomics(input);
  const scenarios = [500, 800, 1000, 1200].map((bps) => ({ bps, r: simulateCommissionChange(input, bps) }));
  return (
    <div className="space-y-4">
      <p className="rounded-md border border-warn/40 bg-warn/10 px-3 py-2 text-xs">SIMULATION — DOES NOT CHANGE LIVE SYSTEM.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Num label="Commission (bps)" value={commissionBps} onChange={setCommissionBps} />
        <Num label="Orders / day" value={orders} onChange={setOrders} />
        <Num label="AOV (₹)" value={aov} onChange={setAov} />
        <Num label="Platform discount / order (₹)" value={discount} onChange={setDiscount} />
        <Num label="Delivery fee (₹)" value={delivery} onChange={setDelivery} />
        <Num label="Customer fee (₹)" value={customerFee} onChange={setCustomerFee} />
        <Num label="Rider payout (₹)" value={rider} onChange={setRider} />
        <Num label="Refund rate (bps)" value={refundBps} onChange={setRefundBps} />
        <Num label="Payment cost (bps)" value={paymentBps} onChange={setPaymentBps} />
        <Num label="Support / order (₹)" value={support} onChange={setSupport} />
        <Num label="Marketing / day (₹)" value={marketing} onChange={setMarketing} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Revenue" value={formatINR(result.revenuePaise)} />
        <Kpi label="Variable cost" value={formatINR(result.variableCostPaise)} />
        <Kpi label="Contribution" value={formatINR(result.contributionPaise)} />
        <Kpi label="Est. monthly (×30)" value={formatINR(result.contributionPaise * 30)} />
      </div>
      <Kpi label="Break-even orders / day" value={result.breakEvenOrdersPerDay == null ? "Not reached at this unit contribution" : String(result.breakEvenOrdersPerDay)} />
      <Card>
        <CardTitle className="mb-3 text-base">If commission changes</CardTitle>
        <ul className="space-y-2 text-sm">
          {scenarios.map((s) => (
            <li key={s.bps} className="flex justify-between">
              <span>{(s.bps / 100).toFixed(2)}%</span>
              <span className="tabular-nums">{formatINR(s.r.contributionPaise)} contribution</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="text-xs text-muted">
      {label}
      <Input type="number" className="mt-1" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} />
    </label>
  );
}

function CeoAi() {
  const [prompt, setPrompt] = useState("How did we perform today?");
  const mut = useMutation({
    mutationFn: async () => {
      const r = await askAssistant({ data: { prompt, mode: "ceo" } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Card>
      <CardTitle className="mb-2">CEO AI</CardTitle>
      <p className="mb-3 text-xs text-muted">Suggestions are not actions. Money movement still needs a human with permission.</p>
      <textarea
        className="mb-3 min-h-24 w-full rounded-sm border border-border bg-elevated p-3 text-sm"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
        {mut.isPending ? "Thinking…" : "Ask"}
      </Button>
      {mut.data ? (
        <pre className="mt-4 whitespace-pre-wrap rounded-md border border-border bg-elevated p-3 text-sm leading-relaxed">
          {mut.data.text}
          <div className="mt-2 text-xs text-subtle">Provider: {mut.data.provider}</div>
        </pre>
      ) : null}
    </Card>
  );
}

function ReportPane() {
  const mut = useMutation({
    mutationFn: async () => {
      const r = await generateCeoReport();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const d = mut.data;
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-2">
        <CardTitle className="text-base">Daily CEO report</CardTitle>
        <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
          Generate
        </Button>
      </div>
      {d ? (
        <div className="space-y-2 text-sm">
          <p className="text-xs text-warn">SIMULATED DATA · {d.period}</p>
          <p>Orders {d.orders} · GMV {formatINR(d.gmvPaise)} · Contribution {formatINR(d.contributionPaise)}</p>
          <p>Top restaurants: {d.topRestaurants.map((r) => r.name).join(", ") || "—"}</p>
          <p>Risks: {d.alerts.join("; ") || "none open"}</p>
          <ul className="list-disc pl-5">
            {d.recommended.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted">One click. Numbers come from authorized tables, not invention.</p>
      )}
    </Card>
  );
}
