import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSupport, mutateTicket } from "@/lib/roshoi/server/api";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { useCan } from "@/components/session";

export const Route = createFileRoute("/_app/support")({ component: () => <RequirePerm perm="view_support"><SupportPage /></RequirePerm> });

function SupportPage() {
  const can = useCan();
  const canManage = can("manage_support");
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["support"],
    queryFn: async () => {
      const r = await getSupport();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const mut = useMutation({
    mutationFn: async (input: Parameters<typeof mutateTicket>[0]["data"]) => {
      const r = await mutateTicket({ data: input });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Ticket updated");
      void qc.invalidateQueries({ queryKey: ["support"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="Support" description="Tickets by category, priority, and SLA. Assignment is an employee action, not an AI decision." />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <TableWrap>
        <thead>
          <tr>
            <Th>Ticket</Th>
            <Th>Category</Th>
            <Th>Subject</Th>
            <Th>Priority</Th>
            <Th>Status</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {(q.data?.tickets ?? []).map((t) => (
            <tr key={String(t.id)}>
              <Td className="font-mono text-xs">{String(t.id)}</Td>
              <Td>{String(t.category)}</Td>
              <Td>{String(t.subject)}</Td>
              <Td>
                <Badge tone={statusTone(String(t.priority))}>{String(t.priority)}</Badge>
              </Td>
              <Td>
                <Badge tone={statusTone(String(t.status))}>{String(t.status)}</Badge>
              </Td>
              <Td>
                {canManage ? (
                  <div className="flex gap-1">
                    <Button size="sm" variant="secondary" onClick={() => mut.mutate({ id: String(t.id), action: "assign" })}>
                      Assign me
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => mut.mutate({ id: String(t.id), action: "status", status: "RESOLVED" })}>
                      Resolve
                    </Button>
                  </div>
                ) : null}
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}
