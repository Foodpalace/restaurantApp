import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as mutateCustomer, K as useCan, l as getCustomers } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { r as formatINR } from "./money-DdTRi1IE.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-Besge28W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomersPage() {
	const canManage = useCan()("manage_customers");
	const [q, setQ] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["customers", q],
		queryFn: async () => {
			const r = await getCustomers({ data: { q } });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const mut = useMutation({
		mutationFn: async (input) => {
			const r = await mutateCustomer({ data: input });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Customer updated");
			qc.invalidateQueries({ queryKey: ["customers"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Customers",
			description: "Minimised personal data. Phones and emails are masked unless a future Shared Core policy expands access."
		}),
		list.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: list.error.message,
			onRetry: () => void list.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search customers",
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "max-w-sm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Reason for status change",
				value: reason,
				onChange: (e) => setReason(e.target.value),
				className: "max-w-sm"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Zone" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Orders" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Lifetime GMV" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Risk" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data?.rows ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [String(c.display_name), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted",
				children: [
					String(c.phone_masked),
					" · ",
					String(c.email_masked)
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: statusTone(String(c.status)),
				children: String(c.status)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(c.zone_code) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(c.order_count) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "tabular-nums",
				children: formatINR(Number(c.lifetime_gmv_paise))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(c.risk_score) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "danger",
				onClick: () => mut.mutate({
					id: String(c.id),
					status: "SUSPENDED",
					reason
				}),
				children: "Suspend"
			}) : null })
		] }, String(c.id))) })] })
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_customers",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomersPage, {})
});
//#endregion
export { SplitComponent as component };
