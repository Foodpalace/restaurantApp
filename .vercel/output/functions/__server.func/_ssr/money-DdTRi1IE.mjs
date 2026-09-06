//#region node_modules/.nitro/vite/services/ssr/assets/money-DdTRi1IE.js
var BPS_DENOMINATOR = 10000n;
/** Half-up multiply of an integer paise amount by a basis-point rate. */
function mulBps(amountPaise, bps) {
	if (!Number.isInteger(amountPaise) || !Number.isInteger(bps)) throw new Error("Money inputs must be integers (paise, basis points)");
	const a = BigInt(amountPaise);
	const b = BigInt(bps);
	const half = 5000n;
	if (a >= 0n) return Number((a * b + half) / BPS_DENOMINATOR);
	return -Number((-a * b + half) / BPS_DENOMINATOR);
}
function addPaise(...parts) {
	let total = 0n;
	for (const p of parts) {
		if (!Number.isInteger(p)) throw new Error("Money inputs must be integers");
		total += BigInt(p);
	}
	return Number(total);
}
function subPaise(left, ...rest) {
	return addPaise(left, ...rest.map((n) => -n));
}
function formatINR(paise, opts) {
	if (!Number.isInteger(paise)) return "—";
	const sign = paise < 0 ? "−" : opts?.sign && paise > 0 ? "+" : "";
	const abs = Math.abs(paise);
	const rupees = Math.floor(abs / 100);
	const frac = abs % 100;
	return `${sign}₹${rupees.toLocaleString("en-IN")}.${String(frac).padStart(2, "0")}`;
}
function formatBps(bps) {
	if (!Number.isInteger(bps)) return "—";
	const whole = Math.trunc(bps / 100);
	const frac = Math.abs(bps % 100);
	return `${whole}.${String(frac).padStart(2, "0")}%`;
}
//#endregion
export { subPaise as a, mulBps as i, formatBps as n, formatINR as r, addPaise as t };
