import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as getAnalytics } from "./session-DoMkRxRe.mjs";
import { r as formatINR } from "./money-DdTRi1IE.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { t as Kpi } from "./kpi-BVqsoTTZ.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-bpH21umq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsPage() {
	const [range, setRange] = (0, import_react.useState)("7d");
	const q = useQuery({
		queryKey: ["analytics", range],
		queryFn: async () => {
			const r = await getAnalytics({ data: { range } });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Analytics",
			description: "Restaurant, rider, and customer aggregates. Rankings use observed orders — no hidden score."
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			className: "mb-4 h-10 rounded-sm border border-border bg-elevated px-2 text-sm",
			value: range,
			onChange: (e) => setRange(e.target.value),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "today",
					children: "Today"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "7d",
					children: "7 days"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "30d",
					children: "30 days"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-xs text-subtle",
			children: [q.data?.period, " · SIMULATED DATA"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-3",
			children: (q.data?.customers ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				label: `Customers ${c.status}`,
				value: String(c.n)
			}, c.status))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Restaurant" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Orders" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "GMV" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Cancels" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data?.restaurants ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.name }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.orders }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "tabular-nums",
				children: formatINR(r.gmv)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.cancels })
		] }, r.id)) })] })
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_analytics",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsPage, {})
});
//#endregion
export { SplitComponent as component };
