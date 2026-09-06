import type { Sql } from "@/lib/db";
import { newId, requestId } from "../ids";
import type { AuthedEmployee } from "./session";

export async function writeAudit(
  sql: Sql,
  actor: AuthedEmployee,
  input: {
    action: string;
    targetType: string;
    targetId: string;
    previousState?: unknown;
    newState?: unknown;
    reason?: string | null;
    requestId?: string;
  },
): Promise<string> {
  const id = newId("aud");
  const rid = input.requestId ?? requestId();
  await sql`
    insert into audit_logs (
      id, org_id, employee_id, role_slug, action, target_type, target_id,
      previous_state, new_state, reason, request_id
    ) values (
      ${id}, ${actor.orgId}, ${actor.employeeId}, ${actor.roleSlug}, ${input.action},
      ${input.targetType}, ${input.targetId},
      ${input.previousState ? JSON.stringify(input.previousState) : null},
      ${input.newState ? JSON.stringify(input.newState) : null},
      ${input.reason ?? null}, ${rid}
    )
  `;
  return id;
}

export async function writeEvent(
  sql: Sql,
  orgId: string,
  input: {
    type: string;
    actorType: string;
    actorId: string | null;
    targetType: string;
    targetId: string;
    payload?: Record<string, string | number | boolean | null>;
    idempotencyKey: string;
  },
): Promise<void> {
  const id = newId("evt");
  await sql`
    insert into domain_events (
      id, org_id, version, type, actor_type, actor_id, target_type, target_id, payload, idempotency_key
    ) values (
      ${id}, ${orgId}, 1, ${input.type}, ${input.actorType}, ${input.actorId},
      ${input.targetType}, ${input.targetId}, ${JSON.stringify(input.payload ?? {})}, ${input.idempotencyKey}
    )
    on conflict (org_id, idempotency_key) do nothing
  `;
}
