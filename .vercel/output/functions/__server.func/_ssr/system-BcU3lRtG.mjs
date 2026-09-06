import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as getSystem, K as useCan, W as saveSystem, f as getHealth, q as useSessionBoot } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as CardTitle, t as Card } from "./card-C7aY7pux.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
import { t as Tabs } from "./tabs-BlcPaBF0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/system-BcU3lRtG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BRAND_TEXT = [
	"appName",
	"tagline",
	"domain",
	"appStoreName",
	"notificationSender",
	"invoiceLegalName",
	"restaurantFacingName",
	"riderFacingName",
	"customerFacingName"
];
var BRAND_COLOR = [
	"colorBg",
	"colorFg",
	"colorAccent",
	"colorSurface"
];
function SystemPage() {
	const can = useCan();
	const canBrand = can("manage_branding");
	const canFlags = can("manage_feature_flags");
	const canSettings = can("manage_system_settings");
	const [tab, setTab] = (0, import_react.useState)("health");
	const qc = useQueryClient();
	const sys = useQuery({
		queryKey: ["system"],
		queryFn: async () => {
			const r = await getSystem();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const health = useQuery({
		queryKey: ["health"],
		queryFn: async () => {
			const r = await getHealth();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const { boot } = useSessionBoot();
	const [brand, setBrand] = (0, import_react.useState)(boot.branding);
	const [reason, setReason] = (0, import_react.useState)("");
	const save = useMutation({
		mutationFn: async (input) => {
			const r = await saveSystem({ data: {
				...input,
				reason
			} });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Saved. Reload to apply branding across the shell.");
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "System",
			description: "Branding, flags, settings, health. Secret keys are never displayed."
		}),
		sys.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: sys.error.message,
			onRetry: () => void sys.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
			tabs: [
				{
					id: "health",
					label: "Health"
				},
				{
					id: "branding",
					label: "Branding"
				},
				{
					id: "flags",
					label: "Flags"
				},
				{
					id: "settings",
					label: "Settings"
				}
			],
			value: tab,
			onChange: setTab
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mt-4 max-w-sm",
			placeholder: "Reason for changes",
			value: reason,
			onChange: (e) => setReason(e.target.value)
		}),
		tab === "health" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: (health.data?.rows ?? []).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: h.key
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: statusTone(h.state),
					children: h.state
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: h.detail
			})] }, h.key))
		}) : null,
		tab === "branding" && canBrand ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid max-w-xl gap-3",
			children: [
				BRAND_TEXT.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs text-muted",
					children: [k, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						value: brand[k],
						onChange: (e) => setBrand({
							...brand,
							[k]: e.target.value
						})
					})]
				}, k)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3",
					children: BRAND_COLOR.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-muted",
						children: [k, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: brand[k],
							onChange: (e) => setBrand({
								...brand,
								[k]: e.target.value
							})
						})]
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save.mutate({
						kind: "branding",
						value: brand
					}),
					children: "Save branding"
				})
			]
		}) : null,
		tab === "flags" && canFlags ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-2",
			children: (sys.data?.flags ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-10 items-center justify-between gap-3 rounded-md border border-border px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm",
					children: f.key
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: f.description
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: f.enabled,
					onChange: (e) => {
						const next = (sys.data?.flags ?? []).map((x) => x.key === f.key ? {
							...x,
							enabled: e.target.checked
						} : x);
						const asMap = Object.fromEntries(next.map((x) => [x.key, {
							enabled: x.enabled,
							description: x.description
						}]));
						save.mutate({
							kind: "flags",
							value: asMap
						});
					}
				})]
			}, f.key))
		}) : null,
		tab === "settings" && canSettings ? sys.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsForm, {
			settings: sys.data.settings ?? {},
			onSave: (value) => save.mutate({
				kind: "settings",
				value
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "Loading settings…"
		}) : null
	] });
}
function SettingsForm({ settings, onSave }) {
	const [draft, setDraft] = (0, import_react.useState)(settings);
	const groups = Object.keys(draft);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Grouped operational settings. Secret keys are never shown. A reason is required above."
			}),
			groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-xs font-medium uppercase tracking-wider text-subtle",
				children: group
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: Object.entries(draft[group] ?? {}).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs text-muted",
					children: [key, typeof value === "boolean" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 flex min-h-10 items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: value,
							onChange: (e) => setDraft({
								...draft,
								[group]: {
									...draft[group],
									[key]: e.target.checked
								}
							})
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						type: typeof value === "number" ? "number" : "text",
						value: String(value),
						onChange: (e) => {
							const next = typeof value === "number" ? Number(e.target.value) || 0 : e.target.value;
							setDraft({
								...draft,
								[group]: {
									...draft[group],
									[key]: next
								}
							});
						}
					})]
				}, key))
			})] }, group)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => onSave(draft),
				children: "Save settings"
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	anyOf: [
		"view_health",
		"manage_system_settings",
		"manage_branding"
	],
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SystemPage, {})
});
//#endregion
export { SplitComponent as component };
