import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kpi-BVqsoTTZ.js
var import_jsx_runtime = require_jsx_runtime();
function Kpi({ label, value, hint, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-lg border border-border bg-elevated/60 px-4 py-3", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wider text-subtle",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-2xl tabular-nums tracking-tight text-fg",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
//#endregion
export { Kpi as t };
