import type { PermissionKey } from "./permissions";

export type NavItem = {
  to: string;
  key: string;
  perm: PermissionKey;
  ceoOnly?: boolean;
};

export type NavSection = {
  id: string;
  labelKey: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "command",
    labelKey: "nav.section.command",
    items: [
      { to: "/", key: "nav.home", perm: "view_dashboard" },
      { to: "/ceo", key: "nav.ceo", perm: "view_executive" },
      { to: "/ai", key: "nav.ai", perm: "view_ai" },
      { to: "/search", key: "nav.search", perm: "view_dashboard" },
    ],
  },
  {
    id: "ops",
    labelKey: "nav.section.ops",
    items: [
      { to: "/orders", key: "nav.orders", perm: "view_orders" },
      { to: "/dispatch", key: "nav.dispatch", perm: "manage_dispatch" },
      { to: "/map", key: "nav.map", perm: "view_orders" },
      { to: "/support", key: "nav.support", perm: "view_support" },
      { to: "/tasks", key: "nav.tasks", perm: "view_dashboard" },
    ],
  },
  {
    id: "network",
    labelKey: "nav.section.network",
    items: [
      { to: "/restaurants", key: "nav.restaurants", perm: "view_restaurants" },
      { to: "/riders", key: "nav.riders", perm: "view_riders" },
      { to: "/customers", key: "nav.customers", perm: "view_customers" },
      { to: "/kyc", key: "nav.kyc", perm: "view_kyc" },
    ],
  },
  {
    id: "growth",
    labelKey: "nav.section.growth",
    items: [
      { to: "/commerce", key: "nav.commerce", perm: "manage_promotions" },
      { to: "/analytics", key: "nav.analytics", perm: "view_analytics" },
    ],
  },
  {
    id: "money",
    labelKey: "nav.section.money",
    items: [
      { to: "/finance", key: "nav.finance", perm: "view_finance" },
    ],
  },
  {
    id: "trust",
    labelKey: "nav.section.trust",
    items: [
      { to: "/risk", key: "nav.risk", perm: "view_fraud" },
      { to: "/security", key: "nav.security", perm: "view_audit_logs" },
      { to: "/audit", key: "nav.audit", perm: "view_audit_logs" },
    ],
  },
  {
    id: "org",
    labelKey: "nav.section.org",
    items: [
      { to: "/people", key: "nav.employees", perm: "manage_users" },
      { to: "/system", key: "nav.settings", perm: "view_health" },
      { to: "/notifications", key: "nav.notifications", perm: "manage_notifications" },
    ],
  },
];

export function visibleNav(permissions: readonly string[]): NavSection[] {
  return NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => permissions.includes(item.perm)),
  })).filter((s) => s.items.length > 0);
}
