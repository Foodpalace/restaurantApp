import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getHealth, getSystem, saveSystem } from "@/lib/roshoi/server/api";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { useCan, useSessionBoot } from "@/components/session";

export const Route = createFileRoute("/_app/system")({
  component: () => (
    <RequirePerm anyOf={["view_health", "manage_system_settings", "manage_branding"]}>
      <SystemPage />
    </RequirePerm>
  ),
});

const BRAND_TEXT = [
  "appName",
  "tagline",
  "domain",
  "appStoreName",
  "notificationSender",
  "invoiceLegalName",
  "restaurantFacingName",
  "riderFacingName",
  "customerFacingName",
] as const;

const BRAND_COLOR = ["colorBg", "colorFg", "colorAccent", "colorSurface"] as const;

function SystemPage() {
  const can = useCan();
  const canBrand = can("manage_branding");
  const canFlags = can("manage_feature_flags");
  const canSettings = can("manage_system_settings");
  const [tab, setTab] = useState("health");
  const qc = useQueryClient();
  const sys = useQuery({
    queryKey: ["system"],
    queryFn: async () => {
      const r = await getSystem();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const health = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const r = await getHealth();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const { boot } = useSessionBoot();
  const [brand, setBrand] = useState(boot.branding);
  const [reason, setReason] = useState("");
  const save = useMutation({
    mutationFn: async (input: { kind: "branding" | "flags" | "settings"; value: unknown }) => {
      const r = await saveSystem({ data: { ...input, reason } });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Saved. Reload to apply branding across the shell.");
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="System" description="Branding, flags, settings, health. Secret keys are never displayed." />
      {sys.error ? <ErrorBanner message={sys.error.message} onRetry={() => void sys.refetch()} /> : null}
      <Tabs
        tabs={[
          { id: "health", label: "Health" },
          { id: "branding", label: "Branding" },
          { id: "flags", label: "Flags" },
          { id: "settings", label: "Settings" },
        ]}
        value={tab}
        onChange={setTab}
      />
      <Input className="mt-4 max-w-sm" placeholder="Reason for changes" value={reason} onChange={(e) => setReason(e.target.value)} />
      {tab === "health" ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(health.data?.rows ?? []).map((h) => (
            <Card key={h.key}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{h.key}</CardTitle>
                <Badge tone={statusTone(h.state)}>{h.state}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted">{h.detail}</p>
            </Card>
          ))}
        </div>
      ) : null}
      {tab === "branding" && canBrand ? (
        <div className="mt-4 grid max-w-xl gap-3">
          {BRAND_TEXT.map((k) => (
            <label key={k} className="text-xs text-muted">
              {k}
              <Input className="mt-1" value={brand[k]} onChange={(e) => setBrand({ ...brand, [k]: e.target.value })} />
            </label>
          ))}
          <div className="grid grid-cols-2 gap-3">
            {BRAND_COLOR.map((k) => (
              <label key={k} className="text-xs text-muted">
                {k}
                <Input className="mt-1" value={brand[k]} onChange={(e) => setBrand({ ...brand, [k]: e.target.value })} />
              </label>
            ))}
          </div>
          <Button onClick={() => save.mutate({ kind: "branding", value: brand })}>Save branding</Button>
        </div>
      ) : null}
      {tab === "flags" && canFlags ? (
        <div className="mt-4 space-y-2">
          {(sys.data?.flags ?? []).map((f) => (
            <label key={f.key} className="flex min-h-10 items-center justify-between gap-3 rounded-md border border-border px-3">
              <span>
                <span className="block text-sm">{f.key}</span>
                <span className="text-xs text-muted">{f.description}</span>
              </span>
              <input
                type="checkbox"
                checked={f.enabled}
                onChange={(e) => {
                  const next = (sys.data?.flags ?? []).map((x) => (x.key === f.key ? { ...x, enabled: e.target.checked } : x));
                  const asMap = Object.fromEntries(next.map((x) => [x.key, { enabled: x.enabled, description: x.description }]));
                  save.mutate({ kind: "flags", value: asMap });
                }}
              />
            </label>
          ))}
        </div>
      ) : null}
      {tab === "settings" && canSettings ? (
        sys.data ? (
          <SettingsForm
            settings={(sys.data.settings as Record<string, Record<string, string | number | boolean>>) ?? {}}
            onSave={(value) => save.mutate({ kind: "settings", value })}
          />
        ) : (
          <p className="mt-4 text-sm text-muted">Loading settings…</p>
        )
      ) : null}
    </div>
  );
}

function SettingsForm({
  settings,
  onSave,
}: {
  settings: Record<string, Record<string, string | number | boolean>>;
  onSave: (value: Record<string, Record<string, string | number | boolean>>) => void;
}) {
  const [draft, setDraft] = useState(settings);
  const groups = Object.keys(draft);
  return (
    <div className="mt-4 space-y-6">
      <p className="text-xs text-muted">Grouped operational settings. Secret keys are never shown. A reason is required above.</p>
      {groups.map((group) => (
        <section key={group}>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-subtle">{group}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(draft[group] ?? {}).map(([key, value]) => (
              <label key={key} className="text-xs text-muted">
                {key}
                {typeof value === "boolean" ? (
                  <span className="mt-1 flex min-h-10 items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setDraft({ ...draft, [group]: { ...draft[group], [key]: e.target.checked } })}
                    />
                  </span>
                ) : (
                  <Input
                    className="mt-1"
                    type={typeof value === "number" ? "number" : "text"}
                    value={String(value)}
                    onChange={(e) => {
                      const next = typeof value === "number" ? Number(e.target.value) || 0 : e.target.value;
                      setDraft({ ...draft, [group]: { ...draft[group], [key]: next } });
                    }}
                  />
                )}
              </label>
            ))}
          </div>
        </section>
      ))}
      <Button onClick={() => onSave(draft)}>Save settings</Button>
    </div>
  );
}
