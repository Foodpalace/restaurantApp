import type { PermissionKey, RoleSlug } from "./permissions";

export type EmployeeStatus = "INVITED" | "PENDING" | "ACTIVE" | "SUSPENDED" | "REVOKED";
export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "RIDER_ASSIGNED"
  | "PICKED_UP"
  | "ON_THE_WAY"
  | "ARRIVED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"
  | "FAILED"
  | "DISPUTED";

export type RestaurantStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "ACTIVE"
  | "PAUSED"
  | "SUSPENDED"
  | "REJECTED"
  | "CLOSED";

export type RiderStatus = "OFFLINE" | "ONLINE" | "BUSY" | "SUSPENDED" | "UNDER_REVIEW";
export type CustomerStatus = "ACTIVE" | "RESTRICTED" | "SUSPENDED" | "DEACTIVATED";
export type TicketStatus = "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED";
export type KycStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED" | "EXPIRED" | "SUSPENDED";
export type HealthState = "HEALTHY" | "DEGRADED" | "DOWN" | "UNKNOWN" | "NOT_CONFIGURED";

export type DateRangeKey = "today" | "yesterday" | "7d" | "30d" | "month" | "custom";

export type EmployeeSession = {
  employeeId: string;
  orgId: string;
  userId: string;
  email: string;
  name: string;
  roleId: string;
  roleSlug: RoleSlug;
  roleName: string;
  teamId: string | null;
  teamName: string | null;
  locationId: string | null;
  locationName: string | null;
  status: EmployeeStatus;
  isCeo: boolean;
  isSimulated: boolean;
  permissions: PermissionKey[];
  access: "ok" | "pending" | "suspended";
};

export type BrandingConfig = {
  appName: string;
  tagline: string;
  colorBg: string;
  colorFg: string;
  colorAccent: string;
  colorSurface: string;
  domain: string;
  appStoreName: string;
  notificationSender: string;
  invoiceLegalName: string;
  restaurantFacingName: string;
  riderFacingName: string;
  customerFacingName: string;
  locale: "en" | "bn" | "as" | "hi";
};

export type FeatureFlag = {
  key: string;
  enabled: boolean;
  description: string;
};

export const FEATURE_FLAG_KEYS = [
  "customer_ai",
  "restaurant_ai",
  "rider_ai",
  "admin_ai",
  "ceo_ai",
  "live_tracking",
  "cod",
  "delivery_otp",
  "pod_photo",
  "qr_pickup",
  "multi_order",
  "loyalty",
  "referrals",
  "promotions",
  "wallet",
  "subscription",
  "quick_commerce",
  "b2b",
  "advanced_dispatch",
  "whatsapp",
  "sms",
  "push",
  "offline_mode",
] as const;

export type FeatureFlagKey = (typeof FEATURE_FLAG_KEYS)[number];

export type MoneyBreakdown = {
  orderValuePaise: number;
  restaurantDiscountPaise: number;
  platformDiscountPaise: number;
  commissionPaise: number;
  paymentFeePaise: number;
  taxPaise: number;
  otherDeductionPaise: number;
  restaurantSettlementPaise: number;
};

export const ORDER_STATUSES: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "RIDER_ASSIGNED",
  "PICKED_UP",
  "ON_THE_WAY",
  "ARRIVED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
  "FAILED",
  "DISPUTED",
];
