import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getRisk, mutateRisk } from "@/lib/roshoi/server/api";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { useCan } from "@/components/session";

export const Route = createFileRoute("/_app/risk")({ component: () => <RequirePerm perm="view_fraud"><RiskPage /></RequirePerm> });

function RiskPage() {
  const can = useCan();
  const canManage = can("manage_fraud");
  const [reason, setReason] = useState("");
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["risk"],
    queryFn: async () => {
      const r = await getRisk();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const mut = useMutation({
    mutationFn: async (input: Parameters<typeof mutateRisk>[0]["data"]) => {
      const r = await mutateRisk({ data: input });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Decision recorded. No automatic ban.");
      void qc.invalidateQueries({ queryKey: ["risk"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="Fraud & risk" description="Signal → score → review → decision → audit. AI never permanently bans anyone on its own." />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <Input className="mb-4 max-w-sm" placeholder="Reason for decision" value={reason} onChange={(e) => setReason(e.target.value)} />
      <TableWrap>
        <thead>
          <tr>
            <Th>Signal</Th>
            <Th>Score</Th>
            <Th>Subject</Th>
            <Th>Status</Th>
            <Th>Detail</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {(q.data?.rows ?? []).map((r) => (
            <tr key={String(r.id)}>
              <Td>{String(r.signal_type)}</Td>
              <Td className="tabular-nums">{String(r.score)}</Td>
              <Td>
                {String(r.subject_type)} {String(r.subject_id)}
              </Td>
              <Td>
                <Badge tone={statusTone(String(r.status))}>{String(r.status)}</Badge>
              </Td>
              <Td className="max-w-xs text-muted">{String(r.details)}</Td>
              <Td>
                {canManage ? (
                  <div className="flex gap-1">
                    <Button size="sm" onClick={() => mut.mutate({ id: String(r.id), decision: "CLEAR", reason })}>
                      Clear
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => mut.mutate({ id: String(r.id), decision: "ESCALATE", reason })}>
                      Escalate
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
