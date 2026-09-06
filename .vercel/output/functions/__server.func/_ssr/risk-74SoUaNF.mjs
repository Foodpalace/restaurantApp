import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { K as useCan, L as mutateRisk, S as getRisk } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/risk-74SoUaNF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RiskPage() {
	const canManage = useCan()("manage_fraud");
	const [reason, setReason] = (0, import_react.useState)("");
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["risk"],
		queryFn: async () => {
			const r = await getRisk();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const mut = useMutation({
		mutationFn: async (input) => {
			const r = await mutateRisk({ data: input });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Decision recorded. No automatic ban.");
			qc.invalidateQueries({ queryKey: ["risk"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Fraud & risk",
			description: "Signal → score → review → decision → audit. AI never permanently bans anyone on its own."
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mb-4 max-w-sm",
			placeholder: "Reason for decision",
			value: reason,
			onChange: (e) => setReason(e.target.value)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Signal" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Score" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Subject" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Detail" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data?.rows ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(r.signal_type) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "tabular-nums",
				children: String(r.score)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [
				String(r.subject_type),
				" ",
				String(r.subject_id)
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: statusTone(String(r.status)),
				children: String(r.status)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "max-w-xs text-muted",
				children: String(r.details)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => mut.mutate({
						id: String(r.id),
						decision: "CLEAR",
						reason
					}),
					children: "Clear"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "danger",
					onClick: () => mut.mutate({
						id: String(r.id),
						decision: "ESCALATE",
						reason
					}),
					children: "Escalate"
				})]
			}) : null })
		] }, String(r.id))) })] })
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_fraud",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskPage, {})
});
//#endregion
export { SplitComponent as component };
