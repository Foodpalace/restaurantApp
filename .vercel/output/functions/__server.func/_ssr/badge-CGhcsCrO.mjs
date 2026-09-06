import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CGhcsCrO.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "neutral", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide", {
			neutral: "bg-elevated text-muted border-border",
			success: "bg-success/15 text-success border-success/30",
			warn: "bg-warn/15 text-warn border-warn/30",
			danger: "bg-danger/15 text-danger border-danger/30",
			info: "bg-info/15 text-info border-info/30"
		}[tone], className),
		children
	});
}
function statusTone(status) {
	const s = status.toUpperCase();
	if ([
		"ACTIVE",
		"ONLINE",
		"DELIVERED",
		"PAID",
		"VERIFIED",
		"RESOLVED",
		"CLOSED",
		"HEALTHY",
		"APPROVED"
	].includes(s)) return "success";
	if ([
		"PENDING",
		"UNDER_REVIEW",
		"WAITING",
		"BUSY",
		"FLAGGED",
		"DEGRADED",
		"INVITED",
		"ASSIGNED"
	].includes(s)) return "warn";
	if ([
		"SUSPENDED",
		"FAILED",
		"CANCELLED",
		"REFUNDED",
		"REJECTED",
		"DOWN",
		"REVOKED"
	].includes(s)) return "danger";
	if (["NOT_CONFIGURED", "UNKNOWN"].includes(s)) return "warn";
	if ([
		"OPEN",
		"PLACED",
		"PREPARING",
		"ON_THE_WAY"
	].includes(s)) return "info";
	return "neutral";
}
//#endregion
export { statusTone as n, Badge as t };
