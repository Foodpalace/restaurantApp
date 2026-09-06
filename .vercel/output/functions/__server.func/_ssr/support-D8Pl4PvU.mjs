import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { B as mutateTicket, K as useCan, T as getSupport } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-D8Pl4PvU.js
var import_jsx_runtime = require_jsx_runtime();
function SupportPage() {
	const canManage = useCan()("manage_support");
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["support"],
		queryFn: async () => {
			const r = await getSupport();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const mut = useMutation({
		mutationFn: async (input) => {
			const r = await mutateTicket({ data: input });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Ticket updated");
			qc.invalidateQueries({ queryKey: ["support"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Support",
			description: "Tickets by category, priority, and SLA. Assignment is an employee action, not an AI decision."
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Ticket" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Category" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Subject" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Priority" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data?.tickets ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "font-mono text-xs",
				children: String(t.id)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(t.category) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(t.subject) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: statusTone(String(t.priority)),
				children: String(t.priority)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: statusTone(String(t.status)),
				children: String(t.status)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => mut.mutate({
						id: String(t.id),
						action: "assign"
					}),
					children: "Assign me"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => mut.mutate({
						id: String(t.id),
						action: "status",
						status: "RESOLVED"
					}),
					children: "Resolve"
				})]
			}) : null })
		] }, String(t.id))) })] })
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_support",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportPage, {})
});
//#endregion
export { SplitComponent as component };
