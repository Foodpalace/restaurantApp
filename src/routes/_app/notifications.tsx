import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/lib/roshoi/server/api";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { Badge, statusTone } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/notifications")({ component: () => <RequirePerm perm="manage_notifications"><NotificationsPage /></RequirePerm> });

function NotificationsPage() {
  const q = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const r = await getNotifications();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  return (
    <div>
      <PageHeader title="Notifications" description="Delivery is only marked sent when a provider confirms it. Current provider: not configured." />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <p className="mb-3 text-xs text-subtle">Provider: {q.data?.provider}</p>
      <TableWrap>
        <thead>
          <tr>
            <Th>Channel</Th>
            <Th>Template</Th>
            <Th>Target</Th>
            <Th>Status</Th>
            <Th>Failure</Th>
          </tr>
        </thead>
        <tbody>
          {(q.data?.rows ?? []).map((n) => (
            <tr key={String(n.id)}>
              <Td>{String(n.channel)}</Td>
              <Td>{String(n.template)}</Td>
              <Td>{String(n.target)}</Td>
              <Td>
                <Badge tone={statusTone(String(n.status))}>{String(n.status)}</Badge>
              </Td>
              <Td className="text-muted">{String(n.failure ?? "")}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}
