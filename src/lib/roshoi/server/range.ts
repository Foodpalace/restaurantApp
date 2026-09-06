const IST_MS = 5.5 * 60 * 60 * 1000;

export function rangeBounds(key: string, customFrom?: string, customTo?: string): { from: string; to: string; label: string } {
  const now = Date.now();
  const istNow = now + IST_MS;
  const ist = new Date(istNow);
  const startIstDay = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) - IST_MS;
  const end = new Date(now + 60_000).toISOString();
  if (key === "yesterday") {
    return {
      from: new Date(startIstDay - 86400000).toISOString(),
      to: new Date(startIstDay).toISOString(),
      label: "Yesterday (IST)",
    };
  }
  if (key === "7d") {
    return { from: new Date(startIstDay - 6 * 86400000).toISOString(), to: end, label: "Last 7 days (IST)" };
  }
  if (key === "30d") {
    return { from: new Date(startIstDay - 29 * 86400000).toISOString(), to: end, label: "Last 30 days (IST)" };
  }
  if (key === "month") {
    const monthStart = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), 1) - IST_MS;
    return { from: new Date(monthStart).toISOString(), to: end, label: "This month (IST)" };
  }
  if (key === "custom" && customFrom && customTo) {
    return { from: customFrom, to: customTo, label: "Custom range" };
  }
  return { from: new Date(startIstDay).toISOString(), to: end, label: "Today (IST)" };
}
