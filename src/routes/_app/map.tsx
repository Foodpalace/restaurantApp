import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMap } from "@/lib/roshoi/server/api";
import { ZONES } from "@/lib/roshoi/defaults";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Badge, statusTone } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/map")({ component: () => <RequirePerm perm="view_orders"><MapPage /></RequirePerm> });

const MIN_LAT = 26.11;
const MAX_LAT = 26.20;
const MIN_LNG = 91.73;
const MAX_LNG = 91.83;

function pct(lat: number, lng: number) {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
  const y = (1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 100;
  return { left: `${Math.min(96, Math.max(2, x))}%`, top: `${Math.min(96, Math.max(2, y))}%` };
}

function MapPage() {
  const q = useQuery({
    queryKey: ["map"],
    queryFn: async () => {
      const r = await getMap();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const restaurants = q.data?.restaurants ?? [];
  const riders = q.data?.riders ?? [];
  return (
    <div>
      <PageHeader title="Live map" description="Schematic Guwahati plot. Map provider is NOT CONFIGURED — OpenStreetMap / MapLibre can replace this adapter later." />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <div className="mb-6 overflow-hidden rounded-xl border border-border bg-elevated">
        <div className="relative aspect-[16/10] bg-[radial-gradient(circle_at_20%_20%,#1c1e22,transparent_45%),radial-gradient(circle_at_80%_70%,#1c1e22,transparent_40%),#141518]">
          {ZONES.map((z) => {
            const pos = pct(z.lat, z.lng);
            return (
              <span
                key={z.code}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-subtle"
                style={pos}
              >
                {z.name}
              </span>
            );
          })}
          {restaurants.map((r) =>
            r.lat != null && r.lng != null ? (
              <span
                key={r.id}
                title={`${r.name} · ${r.status}`}
                className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-accent"
                style={pct(Number(r.lat), Number(r.lng))}
              />
            ) : null,
          )}
          {riders.map((r) =>
            r.lat != null && r.lng != null ? (
              <span
                key={r.id}
                title={`${r.name} · ${r.status}`}
                className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-info"
                style={pct(Number(r.lat), Number(r.lng))}
              />
            ) : null,
          )}
        </div>
        <div className="flex flex-wrap gap-4 border-t border-border px-4 py-2 text-xs text-muted">
          <span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-sm bg-accent" /> Restaurant</span>
          <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-info" /> Rider</span>
          <span>Provider: schematic · NOT CONFIGURED</span>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ZONES.map((z) => {
          const rests = restaurants.filter((r) => r.zone_code === z.code);
          const zoneRiders = riders.filter((r) => r.zone_code === z.code);
          return (
            <div key={z.code} className="min-h-40 rounded-xl border border-border bg-surface p-4">
              <p className="font-medium">{z.name}</p>
              <p className="mt-2 text-xs text-subtle">Restaurants</p>
              <ul className="mt-1 space-y-1 text-sm">
                {rests.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-2">
                    <span className="truncate">{r.name}</span>
                    <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-subtle">Riders</p>
              <ul className="mt-1 space-y-1 text-sm">
                {zoneRiders.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-2">
                    <span className="truncate">{r.name}</span>
                    <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                  </li>
                ))}
                {zoneRiders.length === 0 ? <li className="text-muted">None visible</li> : null}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
