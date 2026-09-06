import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as getTasks, z as mutateTask } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { t as Card } from "./card-C7aY7pux.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-C25gJZjI.js
var import_jsx_runtime = require_jsx_runtime();
function TasksPage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["tasks"],
		queryFn: async () => {
			const r = await getTasks();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const mut = useMutation({
		mutationFn: async (input) => {
			const r = await mutateTask({ data: input });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Task updated");
			qc.invalidateQueries({ queryKey: ["tasks"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Tasks",
			description: "Internal operational work: verify, call, investigate. Not employee surveillance."
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 lg:grid-cols-3",
			children: [
				"OPEN",
				"IN_PROGRESS",
				"DONE"
			].map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs uppercase tracking-wider text-subtle",
				children: col
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: (q.data?.rows ?? []).filter((t) => String(t.status) === col || col === "OPEN" && String(t.status) === "OPEN").map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: String(t.title)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: statusTone(String(t.priority)),
							children: String(t.priority)
						}), col !== "DONE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => mut.mutate({
								id: String(t.id),
								status: col === "OPEN" ? "IN_PROGRESS" : "DONE"
							}),
							children: "Advance"
						}) : null]
					})]
				}, String(t.id)))
			})] }, col))
		})
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_dashboard",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TasksPage, {})
});
//#endregion
export { SplitComponent as component };
