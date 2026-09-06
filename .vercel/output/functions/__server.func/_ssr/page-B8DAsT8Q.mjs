import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { K as useCan } from "./session-DoMkRxRe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-B8DAsT8Q.js
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-medium tracking-tight text-fg md:text-3xl",
			children: title
		}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-2xl text-sm text-muted",
			children: description
		}) : null] }), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: actions
		}) : null]
	});
}
function Denied() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "You do not have access"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "This area is limited to employees with the required permission."
		})]
	});
}
function RequirePerm({ perm, anyOf, children }) {
	const can = useCan();
	if (!(perm ? can(perm) : (anyOf ?? []).some((p) => can(p)))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Denied, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function ErrorBanner({ message, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-start justify-between gap-3 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: message }), onRetry ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "shrink-0 text-xs underline",
			onClick: onRetry,
			children: "Retry"
		}) : null]
	});
}
//#endregion
export { PageHeader as n, RequirePerm as r, ErrorBanner as t };
