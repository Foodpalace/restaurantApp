/**
 * Integer-paise money. Never use floating-point for stored or calculated cash.
 * 1 rupee = 100 paise. Rates are basis points (bps): 10000 = 100%, 1000 = 10%.
 */

export const PAISE_PER_RUPEE = 100;
export const BPS_DENOMINATOR = 10_000n;

/** Half-up multiply of an integer paise amount by a basis-point rate. */
export function mulBps(amountPaise: number, bps: number): number {
  if (!Number.isInteger(amountPaise) || !Number.isInteger(bps)) {
    throw new Error("Money inputs must be integers (paise, basis points)");
  }
  const a = BigInt(amountPaise);
  const b = BigInt(bps);
  const half = 5_000n;
  if (a >= 0n) return Number((a * b + half) / BPS_DENOMINATOR);
  return -Number((-a * b + half) / BPS_DENOMINATOR);
}

export function addPaise(...parts: number[]): number {
  let total = 0n;
  for (const p of parts) {
    if (!Number.isInteger(p)) throw new Error("Money inputs must be integers");
    total += BigInt(p);
  }
  return Number(total);
}

export function subPaise(left: number, ...rest: number[]): number {
  return addPaise(left, ...rest.map((n) => -n));
}

export function rupeesToPaise(rupees: number): number {
  if (!Number.isInteger(rupees)) {
    throw new Error("Use integer rupees or pass paise directly");
  }
  return rupees * PAISE_PER_RUPEE;
}

export function formatINR(paise: number, opts?: { sign?: boolean }): string {
  if (!Number.isInteger(paise)) return "—";
  const sign = paise < 0 ? "−" : opts?.sign && paise > 0 ? "+" : "";
  const abs = Math.abs(paise);
  const rupees = Math.floor(abs / PAISE_PER_RUPEE);
  const frac = abs % PAISE_PER_RUPEE;
  const grouped = rupees.toLocaleString("en-IN");
  return `${sign}₹${grouped}.${String(frac).padStart(2, "0")}`;
}

export function formatCompactINR(paise: number): string {
  if (!Number.isInteger(paise)) return "—";
  const rupees = paise / PAISE_PER_RUPEE;
  const abs = Math.abs(rupees);
  const sign = rupees < 0 ? "−" : "";
  if (abs >= 10_000_000) return `${sign}₹${(abs / 10_000_000).toFixed(2)} Cr`;
  if (abs >= 100_000) return `${sign}₹${(abs / 100_000).toFixed(2)} L`;
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(1)}k`;
  return formatINR(paise);
}

export function formatBps(bps: number): string {
  if (!Number.isInteger(bps)) return "—";
  const whole = Math.trunc(bps / 100);
  const frac = Math.abs(bps % 100);
  return `${whole}.${String(frac).padStart(2, "0")}%`;
}

export function pctBps(numerator: number, denominator: number): number {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
    throw new Error("Ratio inputs must be integers");
  }
  if (denominator === 0) return 0;
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  return Number((n * 10_000n + d / 2n) / d);
}
