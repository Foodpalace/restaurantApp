import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { h as getNotifications } from "./session-DoMkRxRe.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-xENdAsHX.js
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const q = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const r = await getNotifications();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Notifications",
			description: "Delivery is only marked sent when a provider confirms it. Current provider: not configured."
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-xs text-subtle",
			children: ["Provider: ", q.data?.provider]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Channel" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Template" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Target" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Failure" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data?.rows ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(n.channel) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(n.template) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(n.target) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: statusTone(String(n.status)),
				children: String(n.status)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-muted",
				children: String(n.failure ?? "")
			})
		] }, String(n.id))) })] })
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "manage_notifications",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsPage, {})
});
//#endregion
export { SplitComponent as component };
