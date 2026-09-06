import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { F as mutateRestaurant, K as useCan, b as getRestaurants } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { r as formatINR } from "./money-DdTRi1IE.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/restaurants-C3AqSZar.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RestaurantsPage() {
	const can = useCan();
	const canAct = can("manage_restaurants") || can("approve_restaurants");
	const [q, setQ] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["restaurants", q],
		queryFn: async () => {
			const r = await getRestaurants({ data: { q } });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const mut = useMutation({
		mutationFn: async (input) => {
			const r = await mutateRestaurant({ data: input });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Restaurant updated");
			qc.invalidateQueries({ queryKey: ["restaurants"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Restaurants",
			description: "Onboarding, verification, commission, and operational status. Missing documents stay visible until they are actually supplied."
		}),
		list.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: list.error.message,
			onRetry: () => void list.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search restaurants",
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "max-w-sm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Reason for change",
				value: reason,
				onChange: (e) => setReason(e.target.value),
				className: "max-w-sm"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Restaurant" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "KYC" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Zone" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "GMV" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Commission" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data?.rows ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: String(r.name)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted",
					children: [
						String(r.cuisine),
						" · ",
						String(r.onboarding_step)
					]
				}),
				String(r.missing_documents) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-warn",
					children: ["Missing: ", String(r.missing_documents)]
				}) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: statusTone(String(r.status)),
				children: String(r.status)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(r.kyc_status) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(r.zone_code) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "tabular-nums",
				children: formatINR(Number(r.gmv_paise))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
				className: "tabular-nums",
				children: [(Number(r.commission_bps) / 100).toFixed(2), "%"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: canAct ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-1",
				children: [String(r.status) !== "ACTIVE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => mut.mutate({
						id: String(r.id),
						version: Number(r.version),
						action: "approve",
						reason
					}),
					children: "Approve"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "danger",
					onClick: () => mut.mutate({
						id: String(r.id),
						version: Number(r.version),
						action: "status",
						status: "SUSPENDED",
						reason
					}),
					children: "Suspend"
				}), String(r.status) === "PAUSED" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => mut.mutate({
						id: String(r.id),
						version: Number(r.version),
						action: "status",
						status: "PAUSED",
						reason
					}),
					children: "Pause"
				})]
			}) : null })
		] }, String(r.id))) })] })
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_restaurants",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestaurantsPage, {})
});
//#endregion
export { SplitComponent as component };
