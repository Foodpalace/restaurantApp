import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { K as useCan, P as mutatePromotion, c as getCommerce, k as mutateCampaign } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { r as formatINR } from "./money-DdTRi1IE.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as CardTitle, t as Card } from "./card-C7aY7pux.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
import { t as Tabs } from "./tabs-BlcPaBF0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commerce-C4kIg1MX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommercePage() {
	const can = useCan();
	const canPromo = can("manage_promotions");
	const canCamp = can("manage_campaigns");
	const [tab, setTab] = (0, import_react.useState)("promos");
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["commerce"],
		queryFn: async () => {
			const r = await getCommerce();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const [name, setName] = (0, import_react.useState)("New lunch offer");
	const [reason, setReason] = (0, import_react.useState)("");
	const promoMut = useMutation({
		mutationFn: async () => {
			const r = await mutatePromotion({ data: {
				name,
				promoType: "percentage",
				funding: "platform",
				budgetPaise: 5e4,
				discountBps: 1e3,
				minOrderPaise: 2e4,
				status: "ACTIVE",
				reason
			} });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Promotion saved");
			qc.invalidateQueries({ queryKey: ["commerce"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const campMut = useMutation({
		mutationFn: async (id) => {
			const r = await mutateCampaign({ data: {
				id,
				status: "LIVE",
				reason: reason || "Publish"
			} });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Campaign published");
			qc.invalidateQueries({ queryKey: ["commerce"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Growth",
			description: "Promotions, loyalty, campaigns. Publishing requires a human."
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
			tabs: [
				{
					id: "promos",
					label: "Promotions"
				},
				{
					id: "loyalty",
					label: "Loyalty"
				},
				{
					id: "campaigns",
					label: "Marketing"
				}
			],
			value: tab,
			onChange: setTab
		}),
		tab === "promos" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [canPromo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						className: "max-w-xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Reason",
						value: reason,
						onChange: (e) => setReason(e.target.value),
						className: "max-w-xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => promoMut.mutate(),
						children: "Create 10% platform promo"
					})
				]
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Name" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Funding" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Budget" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Spent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data?.promotions ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(p.name) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(p.funding) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "tabular-nums",
					children: formatINR(Number(p.budget_paise))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "tabular-nums",
					children: formatINR(Number(p.spent_paise))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: statusTone(String(p.status)),
					children: String(p.status)
				}) })
			] }, String(p.id))) })] })]
		}) : null,
		tab === "loyalty" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3",
			children: (q.data?.loyalty ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: String(r.name)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						String(r.points_per_rupee),
						" point / rupee · expires in ",
						String(r.expiry_days),
						" days · ",
						String(r.status)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-subtle",
					children: "Liability is capped by expiry. Rules are configurable — no unlimited rewards."
				})
			] }, String(r.id)))
		}) : null,
		tab === "campaigns" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Campaign" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Channel" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Segment" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data?.campaigns ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(c.name) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(c.channel) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(c.segment) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: statusTone(String(c.status)),
				children: String(c.status)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: canCamp && String(c.status) !== "LIVE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: () => campMut.mutate(String(c.id)),
				children: "Publish"
			}) : null })
		] }, String(c.id))) })] }) : null
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	anyOf: [
		"manage_promotions",
		"manage_loyalty",
		"manage_campaigns"
	],
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommercePage, {})
});
//#endregion
export { SplitComponent as component };
