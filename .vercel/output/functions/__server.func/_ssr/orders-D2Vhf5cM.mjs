import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle$1, r as DialogContent$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { K as useCan, N as mutateOrder, _ as getOrder, v as getOrders } from "./session-DoMkRxRe.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { r as formatINR } from "./money-DdTRi1IE.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
import { n as ORDER_STATUSES } from "./types-Bs7TloTr.mjs";
import { t as newId } from "./ids-Dmt_GKG2.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-D2Vhf5cM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-5 shadow-panel", className),
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
			className: "absolute top-3 right-3 rounded-sm p-1 text-muted hover:text-fg",
			"aria-label": "Close",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
		})]
	})] });
}
function DialogTitle({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: "font-display text-xl",
		children
	});
}
function OrdersPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const list = useQuery({
		queryKey: [
			"orders",
			q,
			status
		],
		queryFn: async () => {
			const r = await getOrders({ data: {
				q,
				status,
				page: 0
			} });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Orders",
			description: "Search, inspect timeline, and take permitted actions. Refunds are real writes on this database — never silent."
		}),
		list.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: list.error.message,
			onRetry: () => void list.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Order, customer, restaurant, rider",
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "max-w-sm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-10 rounded-sm border border-border bg-elevated px-2 text-sm",
				value: status,
				onChange: (e) => setStatus(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "All statuses"
				}), ORDER_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Order" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Restaurant" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Value" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Placed" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data?.rows ?? []).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "cursor-pointer hover:bg-elevated/50",
			onClick: () => setOpenId(row.id),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "font-mono text-xs",
					children: row.id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: row.customer_name }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: row.restaurant_name }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: statusTone(row.status),
					children: row.status
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "tabular-nums",
					children: formatINR(row.order_value_paise)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-muted",
					children: String(row.placed_at).slice(0, 16)
				})
			]
		}, row.id)) })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!openId,
			onOpenChange: () => setOpenId(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: openId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDetail, {
				id: openId,
				onClose: () => setOpenId(null)
			}) : null })
		})
	] });
}
function OrderDetail({ id, onClose }) {
	const can = useCan();
	const canCancel = can("cancel_orders");
	const canManage = can("manage_orders");
	const canRefund = can("refund_orders");
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["order", id],
		queryFn: async () => {
			const r = await getOrder({ data: { id } });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const [reason, setReason] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const mut = useMutation({
		mutationFn: async (payload) => {
			const r = await mutateOrder({ data: payload });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		},
		onSuccess: () => {
			toast.success("Order updated");
			qc.invalidateQueries();
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	const o = q.data?.order;
	if (!o) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Loading order…"
	});
	const version = Number(o.version);
	const remaining = Number(o.order_value_paise) - Number(o.refunded_paise);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: String(o.id) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted",
			children: [
				String(o.customer_name),
				" · ",
				String(o.restaurant_name),
				" · ",
				o.rider_name ? String(o.rider_name) : "No rider"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: statusTone(String(o.status)),
				children: String(o.status)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: String(o.payment_status) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-4 grid grid-cols-2 gap-2 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Items ", formatINR(Number(o.order_value_paise))] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Restaurant discount ", formatINR(Number(o.restaurant_discount_paise))] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Platform discount ", formatINR(Number(o.platform_discount_paise))] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Commission ", formatINR(Number(o.commission_paise))] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Payment fee ", formatINR(Number(o.payment_fee_paise))] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Tax (pass-through) ", formatINR(Number(o.tax_paise))] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-span-2 font-medium",
					children: ["Restaurant settlement ", formatINR(Number(o.restaurant_settlement_paise))]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mt-4 text-xs uppercase tracking-wider text-subtle",
			children: "Timeline"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-1 text-sm",
			children: (q.data?.events ?? []).map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "text-muted",
				children: [
					String(ev.at).slice(11, 19),
					" · ",
					ev.actor_type,
					" · ",
					ev.from_status ?? "—",
					" → ",
					ev.to_status,
					" ",
					ev.reason ? `· ${ev.reason}` : ""
				]
			}, ev.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-4 block text-xs text-muted",
			children: ["Reason (required for changes)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-1",
				value: reason,
				onChange: (e) => setReason(e.target.value)
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [canCancel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "danger",
				disabled: mut.isPending,
				onClick: () => mut.mutate({
					id,
					version,
					action: "cancel",
					reason,
					idempotencyKey: newId("idm")
				}),
				children: "Cancel"
			}) : null, canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				disabled: mut.isPending,
				onClick: () => mut.mutate({
					id,
					version,
					action: "transition",
					toStatus: "CONFIRMED",
					reason,
					idempotencyKey: newId("idm")
				}),
				children: "Confirm"
			}) : null]
		}),
		canRefund ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap items-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted",
				children: [
					"Refund paise (max ",
					remaining,
					")",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						value: amount,
						onChange: (e) => setAmount(e.target.value)
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				disabled: mut.isPending,
				onClick: () => mut.mutate({
					id,
					version,
					action: "refund",
					amountPaise: Number(amount),
					reason,
					idempotencyKey: newId("idm")
				}),
				children: "Issue refund"
			})]
		}) : null
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_orders",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdersPage, {})
});
//#endregion
export { SplitComponent as component };
