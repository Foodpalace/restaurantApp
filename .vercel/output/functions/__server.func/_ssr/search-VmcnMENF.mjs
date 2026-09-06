import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as getSearch } from "./session-DoMkRxRe.mjs";
import { n as PageHeader, r as RequirePerm } from "./page-B8DAsT8Q.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-VmcnMENF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PATHS = {
	order: "/orders",
	restaurant: "/restaurants",
	rider: "/riders",
	customer: "/customers",
	employee: "/people"
};
function SearchPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const list = useQuery({
		queryKey: ["search", q],
		enabled: q.trim().length >= 2,
		queryFn: async () => {
			const r = await getSearch({ data: { q } });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Search",
			description: "Authorized entities only. Results respect your role."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mb-4 max-w-lg",
			placeholder: "Order, restaurant, rider, customer, employee",
			value: q,
			onChange: (e) => setQ(e.target.value),
			autoFocus: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border rounded-xl border border-border",
			children: (list.data?.groups ?? []).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: PATHS[g.type] ?? "/",
				className: "flex items-center justify-between px-4 py-3 text-sm hover:bg-elevated/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs uppercase tracking-wider text-subtle",
					children: g.type
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2",
					children: g.title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: g.subtitle
				})]
			}) }, `${g.type}-${g.id}`))
		})
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_dashboard",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchPage, {})
});
//#endregion
export { SplitComponent as component };
