import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { U as runNlQuery, n as askAssistant } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { n as PageHeader, r as RequirePerm } from "./page-B8DAsT8Q.mjs";
import { n as CardTitle, t as Card } from "./card-C7aY7pux.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-D6S5d9lT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AiPage() {
	const [nl, setNl] = (0, import_react.useState)("Show today's refund rate");
	const [prompt, setPrompt] = (0, import_react.useState)("What should we prioritise in the next two hours?");
	const nlMut = useMutation({
		mutationFn: async () => {
			const r = await runNlQuery({ data: { q: nl } });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		},
		onError: (e) => toast.error(e.message)
	});
	const ask = useMutation({
		mutationFn: async () => {
			const r = await askAssistant({ data: {
				prompt,
				mode: "ops"
			} });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "AI assist",
		description: "Read-only queries run immediately. Mutations still need a human with permission."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "mb-2 text-base",
				children: "Natural-language operations"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "mb-3 min-h-24 w-full rounded-sm border border-border bg-elevated p-3 text-sm",
				value: nl,
				onChange: (e) => setNl(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => nlMut.mutate(),
				disabled: nlMut.isPending,
				children: "Run query"
			}),
			nlMut.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed",
				children: nlMut.data.answer
			}) : null
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "mb-2 text-base",
				children: "Employee copilot"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "mb-3 min-h-24 w-full rounded-sm border border-border bg-elevated p-3 text-sm",
				value: prompt,
				onChange: (e) => setPrompt(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => ask.mutate(),
				disabled: ask.isPending,
				children: ask.isPending ? "Thinking…" : "Ask"
			}),
			ask.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", {
				className: "mt-3 whitespace-pre-wrap text-sm leading-relaxed",
				children: [ask.data.text, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-xs text-subtle",
					children: ask.data.provider
				})]
			}) : null
		] })]
	})] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_ai",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiPage, {})
});
//#endregion
export { SplitComponent as component };
