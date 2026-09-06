import type { OrderStatus } from "../types.ts";

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ["CONFIRMED", "CANCELLED", "FAILED", "DISPUTED"],
  CONFIRMED: ["PREPARING", "CANCELLED", "DISPUTED"],
  PREPARING: ["READY", "CANCELLED", "DISPUTED"],
  READY: ["RIDER_ASSIGNED", "CANCELLED", "DISPUTED"],
  RIDER_ASSIGNED: ["PICKED_UP", "READY", "CANCELLED", "DISPUTED"],
  PICKED_UP: ["ON_THE_WAY", "DISPUTED", "FAILED"],
  ON_THE_WAY: ["ARRIVED", "DISPUTED", "FAILED"],
  ARRIVED: ["DELIVERED", "DISPUTED", "FAILED"],
  DELIVERED: ["REFUNDED", "DISPUTED"],
  CANCELLED: ["REFUNDED", "DISPUTED"],
  REFUNDED: ["DISPUTED"],
  FAILED: ["REFUNDED", "DISPUTED"],
  DISPUTED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertTransition(from: OrderStatus, to: OrderStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Cannot move an order from ${from} to ${to}`);
  }
}

export const TERMINAL_STATUSES: OrderStatus[] = ["DELIVERED", "CANCELLED", "REFUNDED", "FAILED"];

export function isActiveDelivery(status: OrderStatus): boolean {
  return (
    status === "RIDER_ASSIGNED" ||
    status === "PICKED_UP" ||
    status === "ON_THE_WAY" ||
    status === "ARRIVED"
  );
}
