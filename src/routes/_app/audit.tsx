import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAudit } from "@/lib/roshoi/server/api";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { TableWrap, Th, Td } from "@/components/ui/table";

export const Route = createFileRoute("/_app/audit")({ component: () => <RequirePerm perm="view_audit_logs"><AuditPage /></RequirePerm> });

function AuditPage() {
  const [q, setQ] = useState("");
  const list = useQuery({
    queryKey: ["audit", q],
    queryFn: async () => {
      const r = await getAudit({ data: { q } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  return (
    <div>
      <PageHeader title="Audit log" description="Immutable events for sensitive actions. Historical financial rows are not overwritten." />
      {list.error ? <ErrorBanner message={list.error.message} onRetry={() => void list.refetch()} /> : null}
      <Input className="mb-4 max-w-sm" placeholder="Search action, target, employee" value={q} onChange={(e) => setQ(e.target.value)} />
      <TableWrap>
        <thead>
          <tr>
            <Th>When</Th>
            <Th>Employee</Th>
            <Th>Role</Th>
            <Th>Action</Th>
            <Th>Target</Th>
            <Th>Reason</Th>
          </tr>
        </thead>
        <tbody>
          {(list.data?.rows ?? []).map((a) => (
            <tr key={String(a.id)}>
              <Td className="text-xs text-muted">{String(a.created_at).slice(0, 19)}</Td>
              <Td>{String(a.employee_name ?? "—")}</Td>
              <Td>{String(a.role_slug ?? "")}</Td>
              <Td>{String(a.action)}</Td>
              <Td className="font-mono text-xs">
                {String(a.target_type)}/{String(a.target_id)}
              </Td>
              <Td className="text-muted">{String(a.reason ?? "")}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}
