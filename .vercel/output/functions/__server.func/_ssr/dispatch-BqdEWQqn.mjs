import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { N as mutateOrder, _ as getOrder, u as getDispatch } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as CardTitle, t as Card } from "./card-C7aY7pux.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as newId } from "./ids-Dmt_GKG2.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dispatch-BqdEWQqn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DispatchPage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["dispatch"],
		queryFn: async () => {
			const r = await getDispatch();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const [reason, setReason] = (0, import_react.useState)("");
	const [riderId, setRiderId] = (0, import_react.useState)("");
	const mut = useMutation({
		mutationFn: async (orderId) => {
			const detail = await getOrder({ data: { id: orderId } });
			if (!detail.ok) throw new Error(detail.error);
			const r = await mutateOrder({ data: {
				id: orderId,
				version: Number(detail.data.order.version),
				action: "reassign",
				riderId,
				reason,
				idempotencyKey: newId("idm")
			} });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		},
		onSuccess: () => {
			toast.success("Rider assigned");
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Dispatch",
			description: "Assign ready orders. Manual override always needs a reason and writes an audit event."
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted",
				children: ["Reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-1",
					value: reason,
					onChange: (e) => setReason(e.target.value)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted",
				children: ["Rider", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mt-1 h-10 w-full rounded-sm border border-border bg-elevated px-2 text-sm",
					value: riderId,
					onChange: (e) => setRiderId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Select available rider"
					}), (q.data?.available ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: String(r.id),
						children: [
							String(r.name),
							" · ",
							String(r.zone_code)
						]
					}, String(r.id)))]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "mb-3 text-base",
				children: "Unassigned"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: (q.data?.unassigned ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						String(o.id),
						" · ",
						String(o.restaurant_name),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "ml-2",
							tone: statusTone(String(o.status)),
							children: String(o.status)
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: mut.isPending,
						onClick: () => mut.mutate(String(o.id)),
						children: "Assign"
					})]
				}, String(o.id)))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "mb-3 text-base",
				children: "Active deliveries"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: (q.data?.assigned ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					String(o.id),
					" · ",
					String(o.rider_name),
					" · ",
					String(o.status)
				] }, String(o.id)))
			})] })]
		})
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "manage_dispatch",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DispatchPage, {})
});
//#endregion
export { SplitComponent as component };
