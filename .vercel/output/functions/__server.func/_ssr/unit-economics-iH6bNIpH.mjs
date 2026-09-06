import { a as subPaise, i as mulBps, t as addPaise } from "./money-DdTRi1IE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unit-economics-iH6bNIpH.js
function computeEconomics(input) {
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
	const variableBeforeMarketing = addPaise(paymentCost, riderCost, refunds, promotions, support, infra);
	const variableCost = addPaise(variableBeforeMarketing, marketing);
	const contribution = subPaise(revenue, variableCost);
	const contributionBeforeMarketing = subPaise(revenue, variableBeforeMarketing);
	const perOrder = orders === 0 ? 0 : Math.trunc(contribution / orders);
	const unitBeforeMarketing = orders === 0 ? 0 : Math.trunc(contributionBeforeMarketing / orders);
	let breakEvenOrdersPerDay = null;
	if (unitBeforeMarketing > 0) breakEvenOrdersPerDay = Math.max(0, Math.ceil(marketing / unitBeforeMarketing));
	else if (marketing === 0 && contribution >= 0) breakEvenOrdersPerDay = 0;
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
		estimatedMonthlyPaise: contribution,
		breakEvenOrdersPerDay
	};
}
function simulateCommissionChange(input, nextBps) {
	return computeEconomics({
		...input,
		commissionBps: nextBps
	});
}
var DEFAULT_PILOT_ASSUMPTIONS = {
	orders: 48,
	aovPaise: 42e3,
	commissionBps: 1e3,
	deliveryFeePaise: 3500,
	customerFeePaise: 500,
	riderPayoutPaise: 4200,
	paymentCostBps: 180,
	platformDiscountPaise: 1200,
	refundRateBps: 180,
	supportCostPaise: 250,
	infraCostPaise: 180,
	marketingSpendPaise: 25e3
};
//#endregion
export { computeEconomics as n, simulateCommissionChange as r, DEFAULT_PILOT_ASSUMPTIONS as t };
