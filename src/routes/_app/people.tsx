import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getPeople, inviteEmployee, mutateEmployee } from "@/lib/roshoi/server/api";
import { ROLE_CATALOG } from "@/lib/roshoi/permissions";
import { ErrorBanner, PageHeader, RequirePerm } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { TableWrap, Th, Td } from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { Card, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_app/people")({ component: () => <RequirePerm perm="manage_users"><PeoplePage /></RequirePerm> });

function PeoplePage() {
  const [tab, setTab] = useState("employees");
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["people"],
    queryFn: async () => {
      const r = await getPeople();
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [roleSlug, setRoleSlug] = useState("customer_support");
  const [reason, setReason] = useState("");
  const invite = useMutation({
    mutationFn: async () => {
      const r = await inviteEmployee({ data: { email, name, roleSlug } });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Invitation created");
      void qc.invalidateQueries({ queryKey: ["people"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const mut = useMutation({
    mutationFn: async (input: Parameters<typeof mutateEmployee>[0]["data"]) => {
      const r = await mutateEmployee({ data: input });
      if (!r.ok) throw new Error(r.error);
    },
    onSuccess: () => {
      toast.success("Employee updated");
      void qc.invalidateQueries({ queryKey: ["people"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="People" description="Invite employees, assign roles, never let someone grant privileges they do not hold." />
      {q.error ? <ErrorBanner message={q.error.message} onRetry={() => void q.refetch()} /> : null}
      <Tabs
        tabs={[
          { id: "employees", label: "Employees" },
          { id: "roles", label: "Roles" },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "employees" ? (
        <div className="mt-4 space-y-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className="h-10 rounded-sm border border-border bg-elevated px-2 text-sm" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
              {ROLE_CATALOG.filter((r) => r.slug !== "ceo").map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
            <Button onClick={() => invite.mutate()} disabled={invite.isPending}>
              Invite
            </Button>
          </div>
          <Input placeholder="Reason for suspend/role change" value={reason} onChange={(e) => setReason(e.target.value)} className="max-w-md" />
          <TableWrap>
            <thead>
              <tr>
                <Th>Employee</Th>
                <Th>Role</Th>
                <Th>Team</Th>
                <Th>Status</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {(q.data?.employees ?? []).map((e) => (
                <tr key={String(e.id)}>
                  <Td>
                    {String(e.name)}
                    <div className="text-xs text-muted">{String(e.email)}</div>
                  </Td>
                  <Td>{String(e.role_name)}</Td>
                  <Td>{String(e.team_name ?? "—")}</Td>
                  <Td>
                    <Badge tone={statusTone(String(e.status))}>{String(e.status)}</Badge>
                  </Td>
                  <Td>
                    <div className="flex gap-1">
                      {String(e.status) === "ACTIVE" ? (
                        <Button size="sm" variant="danger" onClick={() => mut.mutate({ id: String(e.id), version: Number(e.version), action: "status", status: "SUSPENDED", reason })}>
                          Suspend
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => mut.mutate({ id: String(e.id), version: Number(e.version), action: "status", status: "ACTIVE", reason })}>
                          Activate
                        </Button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(q.data?.roles ?? []).map((role) => {
            const keys = (q.data?.perms ?? []).filter((p) => p.role_id === role.id).map((p) => p.permission_key);
            return (
              <Card key={role.id}>
                <CardTitle className="text-base">{role.name}</CardTitle>
                <p className="mt-1 text-xs text-muted">{role.description}</p>
                <p className="mt-2 text-xs text-subtle">{keys.length} permissions</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
