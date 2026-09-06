import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as getAudit } from "./session-DoMkRxRe.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-CFXoubKX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const list = useQuery({
		queryKey: ["audit", q],
		queryFn: async () => {
			const r = await getAudit({ data: { q } });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Audit log",
			description: "Immutable events for sensitive actions. Historical financial rows are not overwritten."
		}),
		list.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: list.error.message,
			onRetry: () => void list.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mb-4 max-w-sm",
			placeholder: "Search action, target, employee",
			value: q,
			onChange: (e) => setQ(e.target.value)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "When" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Employee" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Role" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Action" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Target" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Reason" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data?.rows ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-xs text-muted",
				children: String(a.created_at).slice(0, 19)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(a.employee_name ?? "—") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(a.role_slug ?? "") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(a.action) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
				className: "font-mono text-xs",
				children: [
					String(a.target_type),
					"/",
					String(a.target_id)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-muted",
				children: String(a.reason ?? "")
			})
		] }, String(a.id))) })] })
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_audit_logs",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditPage, {})
});
//#endregion
export { SplitComponent as component };
