import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSecurity } from "@/lib/roshoi/server/api";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { Card, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_app/security")({ component: () => <RequirePerm perm="view_audit_logs"><SecurityPage /></RequirePerm> });

function SecurityPage() {
  const q = useQuery({
    queryKey: ["security"],
    queryFn: async () => {
      const r = await getSecurity();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  return (
    <div>
      <PageHeader title="Security" description="Permission changes and active employees. Secrets are never shown." />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(q.data?.online ?? []).map((e) => (
          <Card key={e.id} className="p-3">
            <CardTitle className="text-base">{e.name}</CardTitle>
            <p className="text-xs text-muted">{e.role_name}</p>
            <p className="mt-1 text-xs text-subtle">Last seen {e.last_seen_at ? String(e.last_seen_at).slice(0, 16) : "never"}</p>
          </Card>
        ))}
      </div>
      <TableWrap>
        <thead>
          <tr>
            <Th>When</Th>
            <Th>Employee</Th>
            <Th>Action</Th>
            <Th>Target</Th>
          </tr>
        </thead>
        <tbody>
          {(q.data?.actions ?? []).map((a) => (
            <tr key={String(a.id)}>
              <Td className="text-xs text-muted">{String(a.created_at).slice(0, 19)}</Td>
              <Td>{String(a.employee_name ?? "—")}</Td>
              <Td>{String(a.action)}</Td>
              <Td className="font-mono text-xs">
                {String(a.target_type)} {String(a.target_id)}
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}
