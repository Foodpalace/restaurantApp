import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tabs-BlcPaBF0.js
var import_jsx_runtime = require_jsx_runtime();
function Tabs({ tabs, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1 rounded-md border border-border bg-elevated p-1",
		role: "tablist",
		children: tabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			role: "tab",
			"aria-selected": value === tab.id,
			className: cn("min-h-9 rounded-sm px-3 text-sm transition-colors", value === tab.id ? "bg-surface text-fg" : "text-muted hover:text-fg"),
			onClick: () => onChange(tab.id),
			children: tab.label
		}, tab.id))
	});
}
//#endregion
export { Tabs as t };
