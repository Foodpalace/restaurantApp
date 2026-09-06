import { getSql, type Sql } from "@/lib/db";
import type { BrandingConfig, EmployeeSession, FeatureFlag } from "../types";
import { DEFAULT_BRANDING, FEATURE_FLAG_LIST, ORG_ID } from "../defaults";
import { can, type PermissionKey } from "../permissions";
import { ensureSeeded } from "./seed";
import { AppError } from "./errors";
import { newId } from "../ids";

export type AuthedEmployee = EmployeeSession & {
  roleDbId: string;
};

function asIso(v: unknown): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "string") return v;
  return String(v);
}

export async function loadUser(sql: Sql, userId: string): Promise<{ id: string; email: string; name: string }> {
  const rows = await sql<{ id: string; email: string; name: string }>`
    select id, email, name from "user" where id = ${userId}
  `;
  const u = rows[0];
  if (!u) {
    return { id: userId, email: `${userId}@local.dev`, name: "Employee" };
  }
  return u;
}

export async function requireEmployee(
  userId: string,
  permission?: PermissionKey,
): Promise<{ sql: Sql; actor: AuthedEmployee; branding: BrandingConfig; flags: FeatureFlag[] }> {
  const sql = await getSql();
  await ensureSeeded(sql);
  const user = await loadUser(sql, userId);

  let emp = (
    await sql<{
      id: string;
      org_id: string;
      user_id: string | null;
      email: string;
      name: string;
      role_id: string;
      slug: string;
      role_name: string;
      is_ceo: boolean;
      team_id: string | null;
      team_name: string | null;
      location_id: string | null;
      location_name: string | null;
      status: EmployeeSession["status"];
    }>`
      select e.id, e.org_id, e.user_id, e.email, e.name, e.role_id, r.slug, r.name as role_name, r.is_ceo,
             e.team_id, t.name as team_name, e.location_id, l.name as location_name, e.status
      from employees e
      join roles r on r.id = e.role_id
      left join teams t on t.id = e.team_id
      left join locations l on l.id = e.location_id
      where e.org_id = ${ORG_ID} and (e.user_id = ${userId} or lower(e.email) = lower(${user.email}))
      order by e.user_id = ${userId} desc
      limit 1
    `
  )[0];

  if (!emp) {
    const existing = await sql<{ n: number }>`select count(*)::int as n from employees where org_id = ${ORG_ID} and user_id is not null`;
    const isFirst = (existing[0]?.n ?? 0) === 0;
    if (!isFirst) {
      const pendingId = newId("emp");
      const analyst = (await sql<{ id: string }>`select id from roles where org_id = ${ORG_ID} and slug = ${"analyst"}`)[0];
      if (!analyst) throw new AppError("SETUP", "Roles are not ready", 500);
      await sql`
        insert into employees (id, org_id, user_id, email, name, role_id, status)
        values (${pendingId}, ${ORG_ID}, ${userId}, ${user.email}, ${user.name}, ${analyst.id}, ${"PENDING"})
      `;
      throw new AppError("PENDING", "Your account is waiting for an administrator to activate access.", 403);
    }
    const ceoRole = (await sql<{ id: string }>`select id from roles where org_id = ${ORG_ID} and slug = ${"ceo"}`)[0];
    if (!ceoRole) throw new AppError("SETUP", "CEO role missing", 500);
    const id = newId("emp");
    await sql`
      insert into employees (id, org_id, user_id, email, name, role_id, team_id, location_id, status, activated_at)
      values (${id}, ${ORG_ID}, ${userId}, ${user.email}, ${user.name}, ${ceoRole.id}, ${"team_ops"}, ${"loc_ganesh"}, ${"ACTIVE"}, now())
    `;
    emp = (
      await sql<typeof emp>`
        select e.id, e.org_id, e.user_id, e.email, e.name, e.role_id, r.slug, r.name as role_name, r.is_ceo,
               e.team_id, t.name as team_name, e.location_id, l.name as location_name, e.status
        from employees e
        join roles r on r.id = e.role_id
        left join teams t on t.id = e.team_id
        left join locations l on l.id = e.location_id
        where e.id = ${id}
      `
    )[0];
  } else if (!emp.user_id) {
    await sql`update employees set user_id = ${userId}, status = ${emp.status === "INVITED" ? "ACTIVE" : emp.status}, activated_at = coalesce(activated_at, now()) where id = ${emp.id}`;
    emp = { ...emp, user_id: userId, status: emp.status === "INVITED" ? "ACTIVE" : emp.status };
  }

  if (!emp) throw new AppError("SETUP", "Could not resolve employee", 500);
  if (emp.status === "SUSPENDED" || emp.status === "REVOKED") {
    throw new AppError("SUSPENDED", "This employee account is suspended.", 403);
  }
  if (emp.status === "PENDING" || emp.status === "INVITED") {
    throw new AppError("PENDING", "Your account is waiting for an administrator to activate access.", 403);
  }

  const perms = await sql<{ permission_key: string }>`
    select permission_key from role_permissions where role_id = ${emp.role_id}
  `;
  const permissions = perms.map((p) => p.permission_key) as PermissionKey[];
  if (permission && !can(permissions, permission)) {
    throw new AppError("FORBIDDEN", "You do not have access to this action.", 403);
  }

  await sql`update employees set last_seen_at = now() where id = ${emp.id}`;

  const actor: AuthedEmployee = {
    employeeId: emp.id,
    orgId: emp.org_id,
    userId,
    email: emp.email,
    name: emp.name,
    roleId: emp.role_id,
    roleDbId: emp.role_id,
    roleSlug: emp.slug as AuthedEmployee["roleSlug"],
    roleName: emp.role_name,
    teamId: emp.team_id,
    teamName: emp.team_name,
    locationId: emp.location_id,
    locationName: emp.location_name,
    status: emp.status,
    isCeo: emp.is_ceo,
    isSimulated: false,
    permissions,
    access: "ok",
  };

  const brandingRow = await sql<{ value: string }>`select value from config_kv where org_id = ${ORG_ID} and key = ${"branding"}`;
  let branding = DEFAULT_BRANDING;
  try {
    if (brandingRow[0]?.value) branding = { ...DEFAULT_BRANDING, ...JSON.parse(brandingRow[0].value) };
  } catch {
    branding = DEFAULT_BRANDING;
  }
  const flagRow = await sql<{ value: string }>`select value from config_kv where org_id = ${ORG_ID} and key = ${"feature_flags"}`;
  let flags = FEATURE_FLAG_LIST;
  try {
    if (flagRow[0]?.value) {
      const parsed = JSON.parse(flagRow[0].value) as Record<string, { enabled: boolean; description?: string }>;
      flags = FEATURE_FLAG_LIST.map((f) => ({
        key: f.key,
        enabled: parsed[f.key]?.enabled ?? f.enabled,
        description: parsed[f.key]?.description ?? f.description,
      }));
    }
  } catch {
    flags = FEATURE_FLAG_LIST;
  }

  void asIso;
  return { sql, actor, branding, flags };
}
