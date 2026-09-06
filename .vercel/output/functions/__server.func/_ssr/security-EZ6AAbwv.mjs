import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { w as getSecurity } from "./session-DoMkRxRe.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as CardTitle, t as Card } from "./card-C7aY7pux.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/security-EZ6AAbwv.js
var import_jsx_runtime = require_jsx_runtime();
function SecurityPage() {
	const q = useQuery({
		queryKey: ["security"],
		queryFn: async () => {
			const r = await getSecurity();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Security",
			description: "Permission changes and active employees. Secrets are never shown."
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: (q.data?.online ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: e.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: e.role_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-subtle",
						children: ["Last seen ", e.last_seen_at ? String(e.last_seen_at).slice(0, 16) : "never"]
					})
				]
			}, e.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "When" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Employee" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Action" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Target" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data?.actions ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-xs text-muted",
				children: String(a.created_at).slice(0, 19)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(a.employee_name ?? "—") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(a.action) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
				className: "font-mono text-xs",
				children: [
					String(a.target_type),
					" ",
					String(a.target_id)
				]
			})
		] }, String(a.id))) })] })
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_audit_logs",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityPage, {})
});
//#endregion
export { SplitComponent as component };
