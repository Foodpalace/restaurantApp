import { cn } from "@/lib/utils";

export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={cn("border-b border-border bg-elevated px-3 py-2 text-xs font-medium uppercase tracking-wider text-subtle", className)}>
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-border px-3 py-2.5 text-fg", className)}>{children}</td>;
}
