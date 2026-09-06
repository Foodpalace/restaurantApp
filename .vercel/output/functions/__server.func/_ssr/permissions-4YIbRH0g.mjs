//#region node_modules/.nitro/vite/services/ssr/assets/permissions-4YIbRH0g.js
var PERMISSIONS = [
	{
		key: "view_dashboard",
		group: "core",
		name: "View dashboard",
		description: "See operational home"
	},
	{
		key: "view_executive",
		group: "core",
		name: "View CEO center",
		description: "Executive command center"
	},
	{
		key: "view_orders",
		group: "orders",
		name: "View orders",
		description: "Read order list and detail"
	},
	{
		key: "manage_orders",
		group: "orders",
		name: "Manage orders",
		description: "Update order operational state"
	},
	{
		key: "cancel_orders",
		group: "orders",
		name: "Cancel orders",
		description: "Cancel an order"
	},
	{
		key: "refund_orders",
		group: "finance",
		name: "Refund orders",
		description: "Issue refunds"
	},
	{
		key: "view_customers",
		group: "customers",
		name: "View customers",
		description: "Read customer records"
	},
	{
		key: "manage_customers",
		group: "customers",
		name: "Manage customers",
		description: "Change customer status"
	},
	{
		key: "view_restaurants",
		group: "restaurants",
		name: "View restaurants",
		description: "Read restaurant records"
	},
	{
		key: "manage_restaurants",
		group: "restaurants",
		name: "Manage restaurants",
		description: "Onboard, pause, suspend"
	},
	{
		key: "approve_restaurants",
		group: "restaurants",
		name: "Approve restaurants",
		description: "Approve or reject applications"
	},
	{
		key: "view_riders",
		group: "riders",
		name: "View riders",
		description: "Read rider records"
	},
	{
		key: "manage_riders",
		group: "riders",
		name: "Manage riders",
		description: "Activate, suspend riders"
	},
	{
		key: "manage_dispatch",
		group: "dispatch",
		name: "Manage dispatch",
		description: "Assign or reassign riders"
	},
	{
		key: "view_finance",
		group: "finance",
		name: "View finance",
		description: "Read financial reports"
	},
	{
		key: "manage_settlements",
		group: "finance",
		name: "Manage settlements",
		description: "Flag, approve, export settlements"
	},
	{
		key: "manage_promotions",
		group: "marketing",
		name: "Manage promotions",
		description: "Create and edit promotions"
	},
	{
		key: "manage_loyalty",
		group: "marketing",
		name: "Manage loyalty",
		description: "Configure loyalty rules"
	},
	{
		key: "manage_campaigns",
		group: "marketing",
		name: "Manage campaigns",
		description: "Publish marketing campaigns"
	},
	{
		key: "view_support",
		group: "support",
		name: "View support",
		description: "Read tickets"
	},
	{
		key: "manage_support",
		group: "support",
		name: "Manage support",
		description: "Assign and resolve tickets"
	},
	{
		key: "view_kyc",
		group: "kyc",
		name: "View KYC",
		description: "Read verification queues"
	},
	{
		key: "manage_kyc",
		group: "kyc",
		name: "Manage KYC",
		description: "Approve or reject KYC"
	},
	{
		key: "view_fraud",
		group: "risk",
		name: "View fraud",
		description: "Read risk signals"
	},
	{
		key: "manage_fraud",
		group: "risk",
		name: "Manage fraud",
		description: "Decide on risk cases"
	},
	{
		key: "view_analytics",
		group: "analytics",
		name: "View analytics",
		description: "Read analytics dashboards"
	},
	{
		key: "view_ai",
		group: "ai",
		name: "View AI",
		description: "Use AI assistants"
	},
	{
		key: "manage_ai",
		group: "ai",
		name: "Manage AI",
		description: "Change AI configuration"
	},
	{
		key: "manage_users",
		group: "admin",
		name: "Manage employees",
		description: "Invite, suspend employees"
	},
	{
		key: "manage_roles",
		group: "admin",
		name: "Manage roles",
		description: "Edit roles and permissions"
	},
	{
		key: "manage_branding",
		group: "admin",
		name: "Manage branding",
		description: "Change brand configuration"
	},
	{
		key: "manage_feature_flags",
		group: "admin",
		name: "Manage feature flags",
		description: "Toggle flags"
	},
	{
		key: "manage_system_settings",
		group: "admin",
		name: "Manage settings",
		description: "Change system configuration"
	},
	{
		key: "view_audit_logs",
		group: "admin",
		name: "View audit logs",
		description: "Read immutable audit trail"
	},
	{
		key: "manage_integrations",
		group: "admin",
		name: "Manage integrations",
		description: "Configure providers"
	},
	{
		key: "manage_notifications",
		group: "admin",
		name: "Manage notifications",
		description: "Templates and delivery log"
	},
	{
		key: "view_health",
		group: "tech",
		name: "View health",
		description: "System health indicators"
	},
	{
		key: "export_data",
		group: "core",
		name: "Export",
		description: "Export authorized reports"
	}
];
var PERMISSION_KEYS = PERMISSIONS.map((p) => p.key);
var ROLE_CATALOG = [
	{
		slug: "ceo",
		name: "CEO / Owner",
		description: "Full executive visibility and authorized controls",
		isCeo: true,
		permissions: [...PERMISSION_KEYS]
	},
	{
		slug: "super_admin",
		name: "Super Admin",
		description: "Full platform administration",
		isCeo: false,
		permissions: [...PERMISSION_KEYS]
	},
	{
		slug: "operations_manager",
		name: "Operations Manager",
		description: "Orders, restaurants, riders, dispatch, operational issues",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_orders",
			"manage_orders",
			"cancel_orders",
			"view_customers",
			"view_restaurants",
			"manage_restaurants",
			"view_riders",
			"manage_riders",
			"manage_dispatch",
			"view_support",
			"manage_support",
			"view_analytics",
			"view_ai",
			"view_health",
			"export_data"
		]
	},
	{
		slug: "area_manager",
		name: "Area Manager",
		description: "Zone-scoped operations",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_orders",
			"manage_orders",
			"view_restaurants",
			"manage_restaurants",
			"view_riders",
			"manage_riders",
			"manage_dispatch",
			"view_support",
			"view_analytics",
			"view_ai"
		]
	},
	{
		slug: "restaurant_onboarding",
		name: "Restaurant Onboarding",
		description: "Restaurant applications and activation",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_restaurants",
			"manage_restaurants",
			"approve_restaurants",
			"view_kyc",
			"manage_kyc",
			"view_ai"
		]
	},
	{
		slug: "restaurant_support",
		name: "Restaurant Support",
		description: "Restaurant issues and settlements visibility",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_orders",
			"view_restaurants",
			"manage_restaurants",
			"view_support",
			"manage_support",
			"view_ai"
		]
	},
	{
		slug: "rider_operations",
		name: "Rider Operations",
		description: "Rider onboarding, status, operational issues",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_riders",
			"manage_riders",
			"manage_dispatch",
			"view_kyc",
			"view_orders",
			"view_ai"
		]
	},
	{
		slug: "rider_support",
		name: "Rider Support",
		description: "Rider tickets and earnings visibility",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_riders",
			"view_support",
			"manage_support",
			"view_ai"
		]
	},
	{
		slug: "customer_support",
		name: "Customer Support",
		description: "Customer accounts, orders, tickets",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_orders",
			"view_customers",
			"manage_customers",
			"view_support",
			"manage_support",
			"view_ai"
		]
	},
	{
		slug: "finance",
		name: "Finance",
		description: "Financial reports and settlement information",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_executive",
			"view_finance",
			"manage_settlements",
			"view_analytics",
			"view_ai",
			"export_data",
			"view_audit_logs"
		]
	},
	{
		slug: "settlement",
		name: "Settlement Staff",
		description: "Restaurant and rider settlement processing",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_finance",
			"manage_settlements",
			"view_restaurants",
			"view_riders",
			"view_ai"
		]
	},
	{
		slug: "marketing",
		name: "Marketing",
		description: "Campaigns, promotions, banners, loyalty",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"manage_promotions",
			"manage_loyalty",
			"manage_campaigns",
			"view_analytics",
			"view_customers",
			"view_ai"
		]
	},
	{
		slug: "kyc",
		name: "KYC / Verification",
		description: "Identity and document review",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_kyc",
			"manage_kyc",
			"view_restaurants",
			"view_riders",
			"view_ai"
		]
	},
	{
		slug: "fraud_risk",
		name: "Fraud / Risk",
		description: "Fraud signals and investigations",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_fraud",
			"manage_fraud",
			"view_orders",
			"view_customers",
			"view_riders",
			"view_ai",
			"view_audit_logs"
		]
	},
	{
		slug: "dispatch_operator",
		name: "Dispatch Operator",
		description: "Live assignment of deliveries",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_orders",
			"manage_dispatch",
			"view_riders",
			"view_restaurants",
			"view_ai"
		]
	},
	{
		slug: "inventory",
		name: "Inventory / Commerce",
		description: "Catalog and availability",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_restaurants",
			"manage_restaurants",
			"view_ai"
		]
	},
	{
		slug: "tech_admin",
		name: "Tech / IT Admin",
		description: "System health, configuration, technical tools",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_health",
			"manage_system_settings",
			"manage_feature_flags",
			"manage_integrations",
			"manage_notifications",
			"view_audit_logs",
			"view_ai"
		]
	},
	{
		slug: "analyst",
		name: "Analyst",
		description: "Read-only analytics",
		isCeo: false,
		permissions: [
			"view_dashboard",
			"view_analytics",
			"view_orders",
			"view_finance",
			"export_data",
			"view_ai"
		]
	}
];
new Set(ROLE_CATALOG.map((r) => r.slug));
function can(permissions, key) {
	return permissions.includes(key);
}
function assertNoPrivilegeEscalation(actorPermissions, nextRoleSlug) {
	if (!can(actorPermissions, "manage_roles") && !can(actorPermissions, "manage_users")) return {
		ok: false,
		error: "You cannot assign roles"
	};
	const target = ROLE_CATALOG.find((r) => r.slug === nextRoleSlug);
	if (!target) return {
		ok: false,
		error: "Unknown role"
	};
	if (!(actorPermissions.length === PERMISSION_KEYS.length && PERMISSION_KEYS.every((k) => actorPermissions.includes(k))) && target.permissions.some((p) => !actorPermissions.includes(p))) return {
		ok: false,
		error: "You cannot grant privileges you do not hold"
	};
	return { ok: true };
}
//#endregion
export { can as i, ROLE_CATALOG as n, assertNoPrivilegeEscalation as r, PERMISSIONS as t };
