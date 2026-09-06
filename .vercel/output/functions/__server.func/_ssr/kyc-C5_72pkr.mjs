import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { K as useCan, M as mutateKyc, p as getKyc } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kyc-C5_72pkr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function KycPage() {
	const canManage = useCan()("manage_kyc");
	const [reason, setReason] = (0, import_react.useState)("");
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["kyc"],
		queryFn: async () => {
			const r = await getKyc();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const mut = useMutation({
		mutationFn: async (input) => {
			const r = await mutateKyc({ data: input });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("KYC updated — documents are not auto-verified");
			qc.invalidateQueries({ queryKey: ["kyc"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "KYC",
			description: "Verification workflow. Sensitive documents stay protected — this view shows summaries, not files."
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Case" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Subject" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Documents" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data?.rows ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "font-mono text-xs",
				children: String(c.id)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [
				String(c.subject_type),
				" ",
				String(c.subject_id)
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: statusTone(String(c.status)),
				children: String(c.status)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-muted",
				children: String(c.documents_summary)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => mut.mutate({
						id: String(c.id),
						status: "VERIFIED",
						reason
					}),
					children: "Verify"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "danger",
					onClick: () => mut.mutate({
						id: String(c.id),
						status: "REJECTED",
						reason
					}),
					children: "Reject"
				})]
			}) : null })
		] }, String(c.id))) })] })
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_kyc",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KycPage, {})
});
//#endregion
export { SplitComponent as component };
