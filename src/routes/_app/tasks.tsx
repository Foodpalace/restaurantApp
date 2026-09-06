import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getTasks, mutateTask } from "@/lib/roshoi/server/api";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_app/tasks")({ component: () => <RequirePerm perm="view_dashboard"><TasksPage /></RequirePerm> });

function TasksPage() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const r = await getTasks();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const mut = useMutation({
    mutationFn: async (input: { id: string; status: string }) => {
      const r = await mutateTask({ data: input });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Task updated");
      void qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const cols = ["OPEN", "IN_PROGRESS", "DONE"];
  return (
    <div>
      <PageHeader title="Tasks" description="Internal operational work: verify, call, investigate. Not employee surveillance." />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <div className="grid gap-3 lg:grid-cols-3">
        {cols.map((col) => (
          <div key={col}>
            <p className="mb-2 text-xs uppercase tracking-wider text-subtle">{col}</p>
            <div className="space-y-2">
              {(q.data?.rows ?? [])
                .filter((t) => String(t.status) === col || (col === "OPEN" && String(t.status) === "OPEN"))
                .map((t) => (
                  <Card key={String(t.id)} className="p-3">
                    <p className="text-sm font-medium">{String(t.title)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge tone={statusTone(String(t.priority))}>{String(t.priority)}</Badge>
                      {col !== "DONE" ? (
                        <Button size="sm" variant="secondary" onClick={() => mut.mutate({ id: String(t.id), status: col === "OPEN" ? "IN_PROGRESS" : "DONE" })}>
                          Advance
                        </Button>
                      ) : null}
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
