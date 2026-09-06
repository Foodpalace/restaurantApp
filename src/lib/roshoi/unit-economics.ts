import { addPaise, mulBps, subPaise } from "./money.ts";

export type EconomicsInput = {
  orders: number;
  aovPaise: number;
  commissionBps: number;
  deliveryFeePaise: number;
  customerFeePaise: number;
  riderPayoutPaise: number;
  paymentCostBps: number;
  platformDiscountPaise: number;
  refundRateBps: number;
  supportCostPaise: number;
  infraCostPaise: number;
  marketingSpendPaise: number;
};

export type EconomicsResult = {
  gmvPaise: number;
  restaurantCommissionPaise: number;
  deliveryRevenuePaise: number;
  customerFeePaise: number;
  otherRevenuePaise: number;
  paymentCostPaise: number;
  riderCostPaise: number;
  refundsPaise: number;
  promotionsPaise: number;
  supportCostPaise: number;
  infraCostPaise: number;
  marketingPaise: number;
  revenuePaise: number;
  variableCostPaise: number;
  contributionPaise: number;
  contributionPerOrderPaise: number;
  unitContributionBeforeMarketingPaise: number;
  estimatedMonthlyPaise: number;
  breakEvenOrdersPerDay: number | null;
};

export function computeEconomics(input: EconomicsInput): EconomicsResult {
  const orders = Math.max(0, Math.trunc(input.orders));
  const gmv = orders * input.aovPaise;
  const commission = mulBps(gmv, input.commissionBps);
  const deliveryRevenue = orders * input.deliveryFeePaise;
  const customerFee = orders * input.customerFeePaise;
  const revenue = addPaise(commission, deliveryRevenue, customerFee);
  const paymentCost = mulBps(gmv, input.paymentCostBps);
  const riderCost = orders * input.riderPayoutPaise;
  const refunds = mulBps(gmv, input.refundRateBps);
  const promotions = orders * input.platformDiscountPaise;
  const support = orders * input.supportCostPaise;
  const infra = orders * input.infraCostPaise;
  const marketing = input.marketingSpendPaise;
  const variableBeforeMarketing = addPaise(
    paymentCost,
    riderCost,
    refunds,
    promotions,
    support,
    infra,
  );
  const variableCost = addPaise(variableBeforeMarketing, marketing);
  const contribution = subPaise(revenue, variableCost);
  const contributionBeforeMarketing = subPaise(revenue, variableBeforeMarketing);
  const perOrder = orders === 0 ? 0 : Math.trunc(contribution / orders);
  const unitBeforeMarketing =
    orders === 0 ? 0 : Math.trunc(contributionBeforeMarketing / orders);
  let breakEvenOrdersPerDay: number | null = null;
  if (unitBeforeMarketing > 0) {
    breakEvenOrdersPerDay = Math.max(0, Math.ceil(marketing / unitBeforeMarketing));
  } else if (marketing === 0 && contribution >= 0) {
    breakEvenOrdersPerDay = 0;
  }
  const estimatedMonthlyPaise = contribution;

  return {
    gmvPaise: gmv,
    restaurantCommissionPaise: commission,
    deliveryRevenuePaise: deliveryRevenue,
    customerFeePaise: customerFee,
    otherRevenuePaise: 0,
    paymentCostPaise: paymentCost,
    riderCostPaise: riderCost,
    refundsPaise: refunds,
    promotionsPaise: promotions,
    supportCostPaise: support,
    infraCostPaise: infra,
    marketingPaise: marketing,
    revenuePaise: revenue,
    variableCostPaise: variableCost,
    contributionPaise: contribution,
    contributionPerOrderPaise: perOrder,
    unitContributionBeforeMarketingPaise: unitBeforeMarketing,
    estimatedMonthlyPaise,
    breakEvenOrdersPerDay,
  };
}

export function perOrderSlice(input: EconomicsInput) {
  const one = computeEconomics({ ...input, orders: 1, marketingSpendPaise: 0 });
  return {
    revenuePerOrder: one.revenuePaise,
    commissionPerOrder: one.restaurantCommissionPaise,
    deliveryRevenuePerOrder: one.deliveryRevenuePaise,
    riderCostPerOrder: one.riderCostPaise,
    paymentCostPerOrder: one.paymentCostPaise,
    promotionCostPerOrder: one.promotionsPaise,
    refundPerOrder: one.refundsPaise,
    supportCostPerOrder: one.supportCostPaise,
    infraPerOrder: one.infraCostPaise,
    contributionPerOrder: one.contributionPaise,
  };
}

export function simulateCommissionChange(input: EconomicsInput, nextBps: number): EconomicsResult {
  return computeEconomics({ ...input, commissionBps: nextBps });
}

export const DEFAULT_PILOT_ASSUMPTIONS: EconomicsInput = {
  orders: 48,
  aovPaise: 42_000,
  commissionBps: 1_000,
  deliveryFeePaise: 3_500,
  customerFeePaise: 500,
  riderPayoutPaise: 4_200,
  paymentCostBps: 180,
  platformDiscountPaise: 1_200,
  refundRateBps: 180,
  supportCostPaise: 250,
  infraCostPaise: 180,
  marketingSpendPaise: 25_000,
};
