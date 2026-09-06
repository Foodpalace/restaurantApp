import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  children,
}: {
  className?: string;
  tone?: "neutral" | "success" | "warn" | "danger" | "info";
  children: React.ReactNode;
}) {
  const tones = {
    neutral: "bg-elevated text-muted border-border",
    success: "bg-success/15 text-success border-success/30",
    warn: "bg-warn/15 text-warn border-warn/30",
    danger: "bg-danger/15 text-danger border-danger/30",
    info: "bg-info/15 text-info border-info/30",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}

export function statusTone(status: string): "neutral" | "success" | "warn" | "danger" | "info" {
  const s = status.toUpperCase();
  if (["ACTIVE", "ONLINE", "DELIVERED", "PAID", "VERIFIED", "RESOLVED", "CLOSED", "HEALTHY", "APPROVED"].includes(s)) return "success";
  if (["PENDING", "UNDER_REVIEW", "WAITING", "BUSY", "FLAGGED", "DEGRADED", "INVITED", "ASSIGNED"].includes(s)) return "warn";
  if (["SUSPENDED", "FAILED", "CANCELLED", "REFUNDED", "REJECTED", "DOWN", "REVOKED"].includes(s)) return "danger";
  if (["NOT_CONFIGURED", "UNKNOWN"].includes(s)) return "warn";
  if (["OPEN", "PLACED", "PREPARING", "ON_THE_WAY"].includes(s)) return "info";
  return "neutral";
}
