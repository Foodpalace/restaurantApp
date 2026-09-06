import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { m as getMap } from "./session-DoMkRxRe.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { o as ZONES } from "./defaults-zsQ0FAhZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-CaIvE2zZ.js
var import_jsx_runtime = require_jsx_runtime();
var MIN_LAT = 26.11;
var MIN_LNG = 91.73;
function pct(lat, lng) {
	const x = (lng - MIN_LNG) / .09999999999999432 * 100;
	const y = (1 - (lat - MIN_LAT) / .08999999999999986) * 100;
	return {
		left: `${Math.min(96, Math.max(2, x))}%`,
		top: `${Math.min(96, Math.max(2, y))}%`
	};
}
function MapPage() {
	const q = useQuery({
		queryKey: ["map"],
		queryFn: async () => {
			const r = await getMap();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const restaurants = q.data?.restaurants ?? [];
	const riders = q.data?.riders ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Live map",
			description: "Schematic Guwahati plot. Map provider is NOT CONFIGURED — OpenStreetMap / MapLibre can replace this adapter later."
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 overflow-hidden rounded-xl border border-border bg-elevated",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[16/10] bg-[radial-gradient(circle_at_20%_20%,#1c1e22,transparent_45%),radial-gradient(circle_at_80%_70%,#1c1e22,transparent_40%),#141518]",
				children: [
					ZONES.map((z) => {
						const pos = pct(z.lat, z.lng);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -translate-x-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-subtle",
							style: pos,
							children: z.name
						}, z.code);
					}),
					restaurants.map((r) => r.lat != null && r.lng != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						title: `${r.name} · ${r.status}`,
						className: "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-accent",
						style: pct(Number(r.lat), Number(r.lng))
					}, r.id) : null),
					riders.map((r) => r.lat != null && r.lng != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						title: `${r.name} · ${r.status}`,
						className: "absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-info",
						style: pct(Number(r.lat), Number(r.lng))
					}, r.id) : null)
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-4 border-t border-border px-4 py-2 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-accent" }), " Restaurant"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-info" }), " Rider"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Provider: schematic · NOT CONFIGURED" })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: ZONES.map((z) => {
				const rests = restaurants.filter((r) => r.zone_code === z.code);
				const zoneRiders = riders.filter((r) => r.zone_code === z.code);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-40 rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: z.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-subtle",
							children: "Restaurants"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1 space-y-1 text-sm",
							children: rests.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: statusTone(r.status),
									children: r.status
								})]
							}, r.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-subtle",
							children: "Riders"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-1 space-y-1 text-sm",
							children: [zoneRiders.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: statusTone(r.status),
									children: r.status
								})]
							}, r.id)), zoneRiders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-muted",
								children: "None visible"
							}) : null]
						})
					]
				}, z.code);
			})
		})
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_orders",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPage, {})
});
//#endregion
export { SplitComponent as component };
