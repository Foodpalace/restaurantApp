import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { I as mutateRider, K as useCan, x as getRiders } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { r as formatINR } from "./money-DdTRi1IE.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/riders-B4BM2DIC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RidersPage() {
	const canManage = useCan()("manage_riders");
	const [reason, setReason] = (0, import_react.useState)("");
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["riders"],
		queryFn: async () => {
			const r = await getRiders({ data: {} });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const mut = useMutation({
		mutationFn: async (input) => {
			const r = await mutateRider({ data: input });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Rider updated");
			qc.invalidateQueries({ queryKey: ["riders"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Riders",
			description: "Availability, KYC, earnings, and COD balance. AI never auto-punishes a rider."
		}),
		list.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: list.error.message,
			onRetry: () => void list.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mb-4 max-w-sm",
			placeholder: "Reason for suspend/restore",
			value: reason,
			onChange: (e) => setReason(e.target.value)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Rider" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "KYC" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Zone" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Earnings" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "COD" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data?.rows ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [String(r.name), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted",
				children: [
					String(r.vehicle),
					" · ",
					Number(r.deliveries),
					" deliveries"
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: statusTone(String(r.status)),
				children: String(r.status)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(r.kyc_status) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(r.zone_code) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "tabular-nums",
				children: formatINR(Number(r.earnings_paise))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "tabular-nums",
				children: formatINR(Number(r.cod_balance_paise))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: String(r.status) === "SUSPENDED" ? "secondary" : "danger",
				onClick: () => mut.mutate({
					id: String(r.id),
					version: Number(r.version),
					status: String(r.status) === "SUSPENDED" ? "OFFLINE" : "SUSPENDED",
					reason
				}),
				children: String(r.status) === "SUSPENDED" ? "Restore" : "Suspend"
			}) : null })
		] }, String(r.id))) })] })
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_riders",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RidersPage, {})
});
//#endregion
export { SplitComponent as component };
