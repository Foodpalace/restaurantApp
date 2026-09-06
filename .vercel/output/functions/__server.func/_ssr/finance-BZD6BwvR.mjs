import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { K as useCan, R as mutateSettlement, d as getFinance } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { r as formatINR } from "./money-DdTRi1IE.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { t as Kpi } from "./kpi-BVqsoTTZ.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-BZD6BwvR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FinancePage() {
	const can = useCan();
	const canExport = can("export_data");
	const canSettle = can("manage_settlements");
	const [reason, setReason] = (0, import_react.useState)("");
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["finance"],
		queryFn: async () => {
			const r = await getFinance({ data: { range: "today" } });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const mut = useMutation({
		mutationFn: async (input) => {
			const r = await mutateSettlement({ data: input });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Settlement updated");
			qc.invalidateQueries({ queryKey: ["finance"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const m = q.data?.money;
	function exportCsv() {
		const rows = q.data?.settlements ?? [];
		const header = "id,party,status,gmv,commission,payout";
		const body = rows.map((s) => [
			s.id,
			s.party_name,
			s.status,
			s.gmv_paise,
			s.commission_paise,
			s.payout_paise
		].join(",")).join("\n");
		const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "roshoi-settlements.csv";
		a.click();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Finance",
			description: "Integer paise. Historical lines are not rewritten — only status/flag changes.",
			actions: canExport ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: exportCsv,
				children: "Export CSV"
			}) : null
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-xs text-subtle",
			children: [q.data?.period, " · SIMULATED DATA"]
		}),
		m ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "GMV",
					value: formatINR(m.gmvPaise)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Platform revenue",
					value: formatINR(m.revenuePaise)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Refunds",
					value: formatINR(m.refundsPaise)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Contribution",
					value: formatINR(m.contributionPaise)
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mb-3 max-w-sm",
			placeholder: "Reason for settlement action",
			value: reason,
			onChange: (e) => setReason(e.target.value)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Party" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Type" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "GMV" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Commission" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Payout" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data?.settlements ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(s.party_name) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(s.party_type) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "tabular-nums",
				children: formatINR(Number(s.gmv_paise))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "tabular-nums",
				children: formatINR(Number(s.commission_paise))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "tabular-nums",
				children: formatINR(Number(s.payout_paise))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: statusTone(String(s.status)),
				children: String(s.status)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: canSettle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => mut.mutate({
						id: String(s.id),
						version: Number(s.version),
						action: "flag",
						reason
					}),
					children: "Flag"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => mut.mutate({
						id: String(s.id),
						version: Number(s.version),
						action: "approve",
						reason
					}),
					children: "Approve"
				})]
			}) : null })
		] }, String(s.id))) })] })
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_finance",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinancePage, {})
});
//#endregion
export { SplitComponent as component };
