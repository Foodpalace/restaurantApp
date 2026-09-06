export type NlIntent =
  | { kind: "refund_rate"; range: "today" | "yesterday" | "7d" }
  | { kind: "delayed_orders"; minutes: number }
  | { kind: "online_riders" }
  | { kind: "compare"; left: "today"; right: "yesterday" }
  | { kind: "restaurants_declining" }
  | { kind: "restaurants_high_cancel" }
  | { kind: "ceo_report"; range: "today" | "week" }
  | { kind: "contribution" }
  | { kind: "profit_drop" }
  | { kind: "rider_shortage" }
  | { kind: "churn_risk" }
  | { kind: "promotion_profit" }
  | { kind: "zone_attention" }
  | { kind: "priorities" }
  | { kind: "unknown"; raw: string };

const DELAY_RE = /delayed over (\d+)\s*minutes|delayed (\d+)\+?\s*min/i;

export function parseNlQuery(raw: string): NlIntent {
  const q = raw.trim().toLowerCase();
  if (!q) return { kind: "unknown", raw };
  if (/refund rate/.test(q)) {
    if (/yesterday/.test(q)) return { kind: "refund_rate", range: "yesterday" };
    if (/week|7/.test(q)) return { kind: "refund_rate", range: "7d" };
    return { kind: "refund_rate", range: "today" };
  }
  const delay = q.match(DELAY_RE);
  if (delay || /delayed/.test(q)) {
    const minutes = Number(delay?.[1] || delay?.[2] || 45);
    return { kind: "delayed_orders", minutes: Number.isFinite(minutes) ? minutes : 45 };
  }
  if (/riders? (currently )?online|list riders/.test(q)) return { kind: "online_riders" };
  if (/compare today vs yesterday|today vs yesterday/.test(q)) {
    return { kind: "compare", left: "today", right: "yesterday" };
  }
  if (/declining orders/.test(q)) return { kind: "restaurants_declining" };
  if (/high cancellation/.test(q)) return { kind: "restaurants_high_cancel" };
  if (/weekly ceo report|ceo report/.test(q)) return { kind: "ceo_report", range: "week" };
  if (/contribution margin|contribution/.test(q)) return { kind: "contribution" };
  if (/profit fall|why did profit/.test(q)) return { kind: "profit_drop" };
  if (/riders? insufficient|rider shortage/.test(q)) return { kind: "rider_shortage" };
  if (/churn/.test(q)) return { kind: "churn_risk" };
  if (/promotions? (are )?profit/.test(q)) return { kind: "promotion_profit" };
  if (/zones? need attention|delivery zones/.test(q)) return { kind: "zone_attention" };
  if (/prioritize tomorrow|biggest operational problems|how did we perform/.test(q)) {
    return { kind: "priorities" };
  }
  return { kind: "unknown", raw };
}
