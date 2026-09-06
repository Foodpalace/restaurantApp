import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/table-BIURJpoC.js
var import_jsx_runtime = require_jsx_runtime();
function TableWrap({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
			className: "w-full min-w-[640px] border-collapse text-left text-sm",
			children
		})
	});
}
function Th({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: cn("border-b border-border bg-elevated px-3 py-2 text-xs font-medium uppercase tracking-wider text-subtle", className),
		children
	});
}
function Td({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: cn("border-b border-border px-3 py-2.5 text-fg", className),
		children
	});
}
//#endregion
export { Td as n, Th as r, TableWrap as t };
