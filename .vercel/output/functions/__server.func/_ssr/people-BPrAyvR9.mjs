import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { O as inviteEmployee, j as mutateEmployee, y as getPeople } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as CardTitle, t as Card } from "./card-C7aY7pux.mjs";
import { n as statusTone, t as Badge } from "./badge-CGhcsCrO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Td, r as Th, t as TableWrap } from "./table-BIURJpoC.mjs";
import { n as ROLE_CATALOG } from "./permissions-4YIbRH0g.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
import { t as Tabs } from "./tabs-BlcPaBF0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people-BPrAyvR9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PeoplePage() {
	const [tab, setTab] = (0, import_react.useState)("employees");
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["people"],
		queryFn: async () => {
			const r = await getPeople();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const [email, setEmail] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [roleSlug, setRoleSlug] = (0, import_react.useState)("customer_support");
	const [reason, setReason] = (0, import_react.useState)("");
	const invite = useMutation({
		mutationFn: async () => {
			const r = await inviteEmployee({ data: {
				email,
				name,
				roleSlug
			} });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Invitation created");
			qc.invalidateQueries({ queryKey: ["people"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const mut = useMutation({
		mutationFn: async (input) => {
			const r = await mutateEmployee({ data: input });
			if (!r.ok) throw new Error(r.error);
		},
		onSuccess: () => {
			toast.success("Employee updated");
			qc.invalidateQueries({ queryKey: ["people"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "People",
			description: "Invite employees, assign roles, never let someone grant privileges they do not hold."
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
			tabs: [{
				id: "employees",
				label: "Employees"
			}, {
				id: "roles",
				label: "Roles"
			}],
			value: tab,
			onChange: setTab
		}),
		tab === "employees" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Name",
							value: name,
							onChange: (e) => setName(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Email",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-10 rounded-sm border border-border bg-elevated px-2 text-sm",
							value: roleSlug,
							onChange: (e) => setRoleSlug(e.target.value),
							children: ROLE_CATALOG.filter((r) => r.slug !== "ceo").map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r.slug,
								children: r.name
							}, r.slug))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => invite.mutate(),
							disabled: invite.isPending,
							children: "Invite"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Reason for suspend/role change",
					value: reason,
					onChange: (e) => setReason(e.target.value),
					className: "max-w-md"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Employee" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Role" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Team" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data?.employees ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [String(e.name), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted",
						children: String(e.email)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(e.role_name) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: String(e.team_name ?? "—") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: statusTone(String(e.status)),
						children: String(e.status)
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: String(e.status) === "ACTIVE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "danger",
							onClick: () => mut.mutate({
								id: String(e.id),
								version: Number(e.version),
								action: "status",
								status: "SUSPENDED",
								reason
							}),
							children: "Suspend"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => mut.mutate({
								id: String(e.id),
								version: Number(e.version),
								action: "status",
								status: "ACTIVE",
								reason
							}),
							children: "Activate"
						})
					}) })
				] }, String(e.id))) })] })
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3 md:grid-cols-2",
			children: (q.data?.roles ?? []).map((role) => {
				const keys = (q.data?.perms ?? []).filter((p) => p.role_id === role.id).map((p) => p.permission_key);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: role.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: role.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-subtle",
						children: [keys.length, " permissions"]
					})
				] }, role.id);
			})
		})
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "manage_users",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeoplePage, {})
});
//#endregion
export { SplitComponent as component };
