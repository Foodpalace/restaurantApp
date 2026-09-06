import assert from "node:assert/strict";
import { test } from "node:test";
import { addPaise, formatINR, mulBps, pctBps, subPaise } from "./money.ts";
import { restaurantSettlement, assertRefundAllowed, remainingRefundable } from "./engine/finance.ts";
import { canTransition } from "./engine/orders.ts";
import { computeEconomics, simulateCommissionChange, DEFAULT_PILOT_ASSUMPTIONS } from "./unit-economics.ts";
import { assertNoPrivilegeEscalation, can, ROLE_CATALOG } from "./permissions.ts";
import { parseNlQuery } from "./engine/nl.ts";
import { assertVersion, nextVersion } from "./engine/concurrency.ts";

test("money: integer paise arithmetic", () => {
  assert.equal(addPaise(199, 1), 200);
  assert.equal(subPaise(200, 50, 25), 125);
  assert.equal(mulBps(10_000, 1_000), 1_000); // 10%
  assert.equal(mulBps(333, 1_000), 33); // half-up
  assert.equal(pctBps(1, 4), 2_500);
  assert.equal(formatINR(123456), "₹1,234.56");
  assert.throws(() => mulBps(1.5, 100));
});

test("settlement: platform discount does not reduce restaurant payout", () => {
  const row = restaurantSettlement({
    orderValuePaise: 50_000,
    restaurantDiscountPaise: 2_000,
    platformDiscountPaise: 5_000,
    commissionBps: 1_000,
    paymentFeePaise: 900,
    taxPaise: 2_500,
    otherDeductionPaise: 0,
  });
  assert.equal(row.commissionPaise, 5_000);
  assert.equal(row.restaurantSettlementPaise, 50_000 - 2_000 - 5_000 - 900);
  assert.equal(row.platformDiscountPaise, 5_000);
});

test("refund: remaining and over-refund", () => {
  assert.equal(remainingRefundable(10_000, 4_000), 6_000);
  assert.throws(() => assertRefundAllowed({ paidPaise: 10_000, alreadyRefundedPaise: 4_000, requestedPaise: 7_000 }));
  assertRefundAllowed({ paidPaise: 10_000, alreadyRefundedPaise: 4_000, requestedPaise: 6_000 });
});

test("order transitions", () => {
  assert.equal(canTransition("PLACED", "CONFIRMED"), true);
  assert.equal(canTransition("DELIVERED", "PLACED"), false);
  assert.equal(canTransition("DELIVERED", "REFUNDED"), true);
});

test("unit economics: commission what-if does not mutate live defaults", () => {
  const base = computeEconomics(DEFAULT_PILOT_ASSUMPTIONS);
  const cut = simulateCommissionChange(DEFAULT_PILOT_ASSUMPTIONS, 800);
  assert.ok(cut.restaurantCommissionPaise < base.restaurantCommissionPaise);
  assert.equal(DEFAULT_PILOT_ASSUMPTIONS.commissionBps, 1_000);
  assert.ok(typeof base.contributionPerOrderPaise === "number");
});

test("RBAC: support cannot grant super admin; marketing cannot hold finance perms", () => {
  const support = ROLE_CATALOG.find((r) => r.slug === "customer_support")!;
  const marketing = ROLE_CATALOG.find((r) => r.slug === "marketing")!;
  const finance = ROLE_CATALOG.find((r) => r.slug === "finance")!;
  assert.equal(can(support.permissions, "manage_settlements"), false);
  assert.equal(can(support.permissions, "view_finance"), false);
  assert.equal(can(marketing.permissions, "manage_system_settings"), false);
  assert.equal(can(finance.permissions, "view_finance"), true);
  const denied = assertNoPrivilegeEscalation(support.permissions, "super_admin");
  assert.equal(denied.ok, false);
  const ceo = ROLE_CATALOG.find((r) => r.slug === "ceo")!;
  const ok = assertNoPrivilegeEscalation(ceo.permissions, "customer_support");
  assert.equal(ok.ok, true);
});

test("NL parser maps operational questions", () => {
  assert.equal(parseNlQuery("Show today's refund rate").kind, "refund_rate");
  assert.equal(parseNlQuery("Find orders delayed over 45 minutes").kind, "delayed_orders");
  assert.equal(parseNlQuery("List riders currently online").kind, "online_riders");
  assert.equal(parseNlQuery("Compare today vs yesterday").kind, "compare");
});

test("optimistic concurrency rejects stale versions", () => {
  assert.equal(nextVersion(3), 4);
  assertVersion(4, 4, "order");
  assert.throws(() => assertVersion(1, 2, "order"), /Another employee changed this order/);
});

test("RBAC catalogue: support cannot refund; marketing cannot change payments", () => {
  const support = ROLE_CATALOG.find((r) => r.slug === "customer_support")!;
  const marketing = ROLE_CATALOG.find((r) => r.slug === "marketing")!;
  const riderOps = ROLE_CATALOG.find((r) => r.slug === "rider_operations")!;
  assert.equal(can(support.permissions, "refund_orders"), false);
  assert.equal(can(support.permissions, "manage_settlements"), false);
  assert.equal(can(marketing.permissions, "manage_system_settings"), false);
  assert.equal(can(riderOps.permissions, "view_finance"), false);
  assert.equal(can(ROLE_CATALOG.find((r) => r.slug === "ceo")!.permissions, "manage_roles"), true);
});
