import { mulBps, subPaise } from "../money.ts";
import type { MoneyBreakdown } from "../types.ts";

export type SettlementInput = {
  orderValuePaise: number;
  restaurantDiscountPaise: number;
  platformDiscountPaise: number;
  commissionBps: number;
  paymentFeePaise: number;
  taxPaise: number;
  otherDeductionPaise: number;
};

/**
 * Transparent restaurant settlement.
 * Platform-funded discounts do not reduce restaurant payout.
 * Tax is shown as pass-through (customer-paid) and is not a hidden deduction.
 */
export function restaurantSettlement(input: SettlementInput): MoneyBreakdown {
  const commissionPaise = mulBps(input.orderValuePaise, input.commissionBps);
  const restaurantSettlementPaise = subPaise(
    input.orderValuePaise,
    input.restaurantDiscountPaise,
    commissionPaise,
    input.paymentFeePaise,
    input.otherDeductionPaise,
  );
  return {
    orderValuePaise: input.orderValuePaise,
    restaurantDiscountPaise: input.restaurantDiscountPaise,
    platformDiscountPaise: input.platformDiscountPaise,
    commissionPaise,
    paymentFeePaise: input.paymentFeePaise,
    taxPaise: input.taxPaise,
    otherDeductionPaise: input.otherDeductionPaise,
    restaurantSettlementPaise,
  };
}

export type RefundCheck = {
  alreadyRefundedPaise: number;
  paidPaise: number;
  requestedPaise: number;
};

export function assertRefundAllowed(check: RefundCheck): void {
  if (!Number.isInteger(check.requestedPaise) || check.requestedPaise <= 0) {
    throw new Error("Refund amount must be a positive integer paise value");
  }
  const remaining = check.paidPaise - check.alreadyRefundedPaise;
  if (check.requestedPaise > remaining) {
    throw new Error("Refund exceeds remaining paid amount");
  }
}

export function remainingRefundable(paidPaise: number, alreadyRefundedPaise: number): number {
  return Math.max(0, paidPaise - alreadyRefundedPaise);
}
