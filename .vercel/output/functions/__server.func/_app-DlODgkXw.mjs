import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { J as useT, K as useCan, g as getOpsHome } from "./_ssr/session-DoMkRxRe.mjs";
import { r as formatINR } from "./_ssr/money-DdTRi1IE.mjs";
import { n as PageHeader, t as ErrorBanner } from "./_ssr/page-B8DAsT8Q.mjs";
import { n as CardTitle, t as Card } from "./_ssr/card-C7aY7pux.mjs";
import { t as Kpi } from "./_ssr/kpi-BVqsoTTZ.mjs";
import { n as statusTone, t as Badge } from "./_ssr/badge-CGhcsCrO.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-DlODgkXw.js
var import_jsx_runtime = require_jsx_runtime();
function HomePage() {
	const tr = useT();
	const can = useCan();
	const showExecutive = can("view_executive");
	const showFinance = can("view_finance");
	const q = useQuery({
		queryKey: ["ops-home"],
		queryFn: async () => {
			const r = await getOpsHome();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const dash = (v) => q.isPending ? "…" : String(v ?? "—");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: tr("nav.home"),
			description: "What is happening, what is wrong, what needs action, and whether today is making money.",
			actions: showExecutive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/ceo",
				className: "inline-flex h-10 items-center rounded-sm bg-accent px-4 text-sm font-medium text-accent-fg",
				children: "Open Command Center"
			}) : null
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-xs text-subtle",
			children: [
				q.data?.period ?? "Today",
				" · ",
				tr("sim.short")
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-2 text-xs font-medium uppercase tracking-wider text-subtle",
			children: tr("home.happening")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Orders today",
					value: dash(q.data?.today?.orders)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Unassigned",
					value: dash(q.data?.today?.unassigned)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Riders online",
					value: dash(q.data?.today?.online_riders)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Open tickets",
					value: dash(q.data?.today?.open_tickets)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-2 text-xs font-medium uppercase tracking-wider text-subtle",
			children: tr("home.wrong")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 space-y-2",
			children: [(q.data?.alerts ?? []).length === 0 && !q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No open alerts."
			}) : null, (q.data?.alerts ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: a.message
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: statusTone(a.severity),
					children: a.severity
				})]
			}, a.id))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-2 text-xs font-medium uppercase tracking-wider text-subtle",
			children: tr("home.action")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueueCard, {
					title: "Support",
					to: "/support",
					rows: (q.data?.queue.tickets ?? []).map((r) => ({
						id: r.id,
						label: r.subject,
						meta: r.priority
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueueCard, {
					title: "Restaurant onboarding",
					to: "/restaurants",
					rows: (q.data?.queue.onboarding ?? []).map((r) => ({
						id: r.id,
						label: r.name,
						meta: r.status
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueueCard, {
					title: "KYC",
					to: "/kyc",
					rows: (q.data?.queue.kyc ?? []).map((r) => ({
						id: r.id,
						label: `${r.subject_type} ${r.subject_id}`,
						meta: r.status
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueueCard, {
					title: "Settlements",
					to: "/finance",
					rows: (q.data?.queue.settlements ?? []).map((r) => ({
						id: r.id,
						label: `${r.party_type} ${r.party_id}`,
						meta: r.status
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueueCard, {
					title: "Risk",
					to: "/risk",
					rows: (q.data?.queue.risk ?? []).map((r) => ({
						id: r.id,
						label: r.signal_type,
						meta: String(r.score)
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueueCard, {
					title: "Dispatch",
					to: "/dispatch",
					rows: (q.data?.queue.dispatch ?? []).map((r) => ({
						id: r.id,
						label: r.id,
						meta: r.status
					}))
				})
			]
		}),
		showFinance ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-2 text-xs font-medium uppercase tracking-wider text-subtle",
			children: tr("home.money")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "GMV today",
					value: q.data?.kpis ? formatINR(q.data.kpis.gmvPaise) : dash(void 0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Platform revenue",
					value: q.data?.kpis ? formatINR(q.data.kpis.revenuePaise) : dash(void 0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Contribution",
					value: q.data?.kpis ? formatINR(q.data.kpis.contributionPaise) : dash(void 0),
					hint: "After variable costs. Simulated."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Refunds",
					value: q.data?.kpis ? formatINR(q.data.kpis.refundsPaise) : dash(void 0)
				})
			]
		})] }) : null
	] });
}
function QueueCard({ title, to, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to,
				className: "text-xs text-muted underline",
				children: "Open"
			})]
		}),
		rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Queue is clear."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: r.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: r.meta })]
			}, r.id))
		})
	] });
}
//#endregion
export { HomePage as component };
