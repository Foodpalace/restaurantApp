/**
 * Versioned integration contracts for Windows 1–3 and future Window 5 Shared Core.
 * These are the shapes Window 4 expects. Shared Core becomes authoritative later.
 */

export const API_VERSION = "v1";

export const ADMIN_PATHS = {
  dashboard: "/v1/admin/dashboard",
  orders: "/v1/admin/orders",
  customers: "/v1/admin/customers",
  restaurants: "/v1/admin/restaurants",
  riders: "/v1/admin/riders",
  employees: "/v1/admin/employees",
  roles: "/v1/admin/roles",
  permissions: "/v1/admin/permissions",
  support: "/v1/admin/support",
  finance: "/v1/admin/finance",
  settlements: "/v1/admin/settlements",
  promotions: "/v1/admin/promotions",
  loyalty: "/v1/admin/loyalty",
  analytics: "/v1/admin/analytics",
  risk: "/v1/admin/risk",
  config: "/v1/admin/config",
  branding: "/v1/admin/branding",
  featureFlags: "/v1/admin/feature-flags",
  audit: "/v1/admin/audit",
  ai: "/v1/admin/ai",
} as const;

export const EVENT_TYPES = [
  "ORDER_CREATED",
  "ORDER_CONFIRMED",
  "ORDER_PREPARING",
  "ORDER_READY",
  "RIDER_ASSIGNED",
  "ORDER_PICKED_UP",
  "ORDER_ON_THE_WAY",
  "ORDER_DELIVERED",
  "ORDER_CANCELLED",
  "PAYMENT_CONFIRMED",
  "PAYMENT_FAILED",
  "REFUND_CREATED",
  "REFUND_COMPLETED",
  "RESTAURANT_ACTIVATED",
  "RIDER_ACTIVATED",
  "SETTLEMENT_CREATED",
  "SETTLEMENT_PAID",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type DomainEvent = {
  id: string;
  version: 1;
  type: EventType;
  occurredAt: string;
  orgId: string;
  actorType: "customer" | "restaurant" | "rider" | "employee" | "system";
  actorId: string | null;
  targetType: string;
  targetId: string;
  payload: Record<string, string | number | boolean | null>;
  idempotencyKey: string;
};

export type Window1CustomerContract = {
  customerId: string;
  status: string;
  orders: string[];
  supportTicketIds: string[];
  promotions: string[];
  loyaltyPoints: number;
};

export type Window2RestaurantContract = {
  restaurantId: string;
  status: string;
  menuVersion: number;
  orderIds: string[];
  settlementIds: string[];
};

export type Window3RiderContract = {
  riderId: string;
  status: string;
  availability: "ONLINE" | "OFFLINE" | "BUSY";
  activeDeliveryId: string | null;
  earningsPaise: number;
  codBalancePaise: number;
};

export type SharedCoreOwnership =
  | "users"
  | "roles"
  | "permissions"
  | "orders"
  | "restaurants"
  | "riders"
  | "customers"
  | "payments"
  | "settlements"
  | "events"
  | "notifications"
  | "audit"
  | "configuration";

export const SHARED_CORE_OWNED: SharedCoreOwnership[] = [
  "users",
  "roles",
  "permissions",
  "orders",
  "restaurants",
  "riders",
  "customers",
  "payments",
  "settlements",
  "events",
  "notifications",
  "audit",
  "configuration",
];
