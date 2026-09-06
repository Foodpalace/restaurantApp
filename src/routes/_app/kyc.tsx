import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getKyc, mutateKyc } from "@/lib/roshoi/server/api";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { useCan } from "@/components/session";

export const Route = createFileRoute("/_app/kyc")({ component: () => <RequirePerm perm="view_kyc"><KycPage /></RequirePerm> });

function KycPage() {
  const can = useCan();
  const canManage = can("manage_kyc");
  const [reason, setReason] = useState("");
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["kyc"],
    queryFn: async () => {
      const r = await getKyc();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const mut = useMutation({
    mutationFn: async (input: Parameters<typeof mutateKyc>[0]["data"]) => {
      const r = await mutateKyc({ data: input });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("KYC updated — documents are not auto-verified");
      void qc.invalidateQueries({ queryKey: ["kyc"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="KYC" description="Verification workflow. Sensitive documents stay protected — this view shows summaries, not files." />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <Input className="mb-4 max-w-sm" placeholder="Reason for decision" value={reason} onChange={(e) => setReason(e.target.value)} />
      <TableWrap>
        <thead>
          <tr>
            <Th>Case</Th>
            <Th>Subject</Th>
            <Th>Status</Th>
            <Th>Documents</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {(q.data?.rows ?? []).map((c) => (
            <tr key={String(c.id)}>
              <Td className="font-mono text-xs">{String(c.id)}</Td>
              <Td>
                {String(c.subject_type)} {String(c.subject_id)}
              </Td>
              <Td>
                <Badge tone={statusTone(String(c.status))}>{String(c.status)}</Badge>
              </Td>
              <Td className="text-muted">{String(c.documents_summary)}</Td>
              <Td>
                {canManage ? (
                  <div className="flex gap-1">
                    <Button size="sm" onClick={() => mut.mutate({ id: String(c.id), status: "VERIFIED", reason })}>
                      Verify
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => mut.mutate({ id: String(c.id), status: "REJECTED", reason })}>
                      Reject
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
