-- Roshoi Window 4 — Admin + CEO operational schema.
-- Money is INTEGER/BIGINT paise. Never floating-point cash.
-- Simulated marketplace rows live here until Window 5 Shared Core is authoritative.

create table if not exists organizations (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists locations (
  id text primary key,
  org_id text not null references organizations(id),
  name text not null,
  zone_code text not null,
  lat double precision,
  lng double precision
);

create table if not exists teams (
  id text primary key,
  org_id text not null references organizations(id),
  name text not null,
  slug text not null,
  location_id text references locations(id)
);

create table if not exists roles (
  id text primary key,
  org_id text not null references organizations(id),
  slug text not null,
  name text not null,
  description text not null default '',
  is_ceo boolean not null default false,
  is_system boolean not null default true,
  unique (org_id, slug)
);

create table if not exists role_permissions (
  role_id text not null references roles(id) on delete cascade,
  permission_key text not null,
  primary key (role_id, permission_key)
);

create table if not exists employees (
  id text primary key,
  org_id text not null references organizations(id),
  user_id text,
  email text not null,
  name text not null,
  role_id text not null references roles(id),
  team_id text references teams(id),
  location_id text references locations(id),
  status text not null,
  invited_by text,
  invited_at timestamptz,
  activated_at timestamptz,
  last_seen_at timestamptz,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

create unique index if not exists employees_org_email_idx on employees (org_id, email);
create index if not exists employees_user_id_idx on employees (user_id);

create table if not exists employee_invites (
  id text primary key,
  org_id text not null references organizations(id),
  email text not null,
  role_id text not null references roles(id),
  team_id text,
  location_id text,
  status text not null,
  invited_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists employee_sessions (
  id text primary key,
  org_id text not null,
  employee_id text not null references employees(id),
  user_id text not null,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  ip text,
  user_agent text
);

create table if not exists shifts (
  id text primary key,
  org_id text not null,
  employee_id text not null references employees(id),
  started_at timestamptz not null,
  ended_at timestamptz,
  location_id text
);

create table if not exists audit_logs (
  id text primary key,
  org_id text not null,
  employee_id text,
  role_slug text,
  action text not null,
  target_type text not null,
  target_id text not null,
  previous_state text,
  new_state text,
  reason text,
  ip text,
  user_agent text,
  request_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_org_created_idx on audit_logs (org_id, created_at desc);

create table if not exists config_kv (
  org_id text not null,
  key text not null,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by text,
  version integer not null default 1,
  primary key (org_id, key)
);

create table if not exists customers (
  id text primary key,
  org_id text not null,
  display_name text not null,
  phone_masked text not null,
  email_masked text not null,
  status text not null,
  zone_code text not null,
  loyalty_points integer not null default 0,
  order_count integer not null default 0,
  lifetime_gmv_paise bigint not null default 0,
  risk_score integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists restaurants (
  id text primary key,
  org_id text not null,
  name text not null,
  cuisine text not null,
  status text not null,
  zone_code text not null,
  commission_bps integer not null,
  rating_bps integer not null default 4500,
  lat double precision,
  lng double precision,
  kyc_status text not null,
  onboarding_step text not null default 'APPLICATION',
  missing_documents text not null default '',
  avg_prep_minutes integer not null default 18,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists riders (
  id text primary key,
  org_id text not null,
  name text not null,
  status text not null,
  vehicle text not null,
  zone_code text not null,
  kyc_status text not null,
  lat double precision,
  lng double precision,
  active_order_id text,
  earnings_paise bigint not null default 0,
  cod_balance_paise bigint not null default 0,
  acceptance_bps integer not null default 9000,
  deliveries integer not null default 0,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  org_id text not null,
  customer_id text not null references customers(id),
  restaurant_id text not null references restaurants(id),
  rider_id text references riders(id),
  status text not null,
  payment_status text not null,
  placed_at timestamptz not null,
  updated_at timestamptz not null default now(),
  order_value_paise integer not null,
  restaurant_discount_paise integer not null default 0,
  platform_discount_paise integer not null default 0,
  delivery_fee_paise integer not null default 0,
  customer_fee_paise integer not null default 0,
  commission_paise integer not null default 0,
  payment_fee_paise integer not null default 0,
  tax_paise integer not null default 0,
  rider_payout_paise integer not null default 0,
  other_deduction_paise integer not null default 0,
  restaurant_settlement_paise integer not null default 0,
  refunded_paise integer not null default 0,
  items_json text not null default '[]',
  delay_minutes integer not null default 0,
  version integer not null default 1,
  idempotency_key text
);
create unique index if not exists orders_idempotency_idx on orders (org_id, idempotency_key) where idempotency_key is not null;
create index if not exists orders_org_status_idx on orders (org_id, status);
create index if not exists orders_org_placed_idx on orders (org_id, placed_at desc);

create table if not exists order_events (
  id text primary key,
  org_id text not null,
  order_id text not null references orders(id),
  at timestamptz not null default now(),
  actor_type text not null,
  actor_id text,
  from_status text,
  to_status text,
  reason text
);
create index if not exists order_events_order_idx on order_events (order_id, at);

create table if not exists refunds (
  id text primary key,
  org_id text not null,
  order_id text not null references orders(id),
  amount_paise integer not null,
  status text not null,
  reason text not null,
  requested_by text not null,
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique (org_id, idempotency_key)
);

create table if not exists settlements (
  id text primary key,
  org_id text not null,
  party_type text not null,
  party_id text not null,
  period_start date not null,
  period_end date not null,
  gmv_paise bigint not null,
  commission_paise bigint not null,
  payout_paise bigint not null,
  adjustments_paise bigint not null default 0,
  status text not null,
  version integer not null default 1,
  flagged_reason text,
  unique (org_id, party_type, party_id, period_start, period_end)
);

create table if not exists tickets (
  id text primary key,
  org_id text not null,
  category text not null,
  status text not null,
  priority text not null,
  subject text not null,
  customer_id text,
  order_id text,
  restaurant_id text,
  rider_id text,
  assigned_employee_id text,
  team_id text,
  sla_due timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ticket_messages (
  id text primary key,
  ticket_id text not null references tickets(id),
  author_type text not null,
  author_id text,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id text primary key,
  org_id text not null,
  title text not null,
  kind text not null,
  status text not null,
  priority text not null,
  due_at timestamptz,
  owner_id text,
  team_id text,
  target_type text,
  target_id text,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists promotions (
  id text primary key,
  org_id text not null,
  name text not null,
  promo_type text not null,
  discount_bps integer,
  discount_paise integer,
  min_order_paise integer not null default 0,
  funding text not null,
  budget_paise bigint not null,
  spent_paise bigint not null default 0,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  eligibility text not null default 'all',
  max_discount_paise integer,
  zone_code text,
  restaurant_id text,
  status text not null
);

create table if not exists loyalty_rules (
  id text primary key,
  org_id text not null,
  name text not null,
  points_per_rupee integer not null,
  expiry_days integer not null,
  tier_json text not null,
  status text not null
);

create table if not exists campaigns (
  id text primary key,
  org_id text not null,
  name text not null,
  channel text not null,
  status text not null,
  segment text not null,
  budget_paise bigint not null,
  spent_paise bigint not null default 0,
  starts_at timestamptz,
  ends_at timestamptz
);

create table if not exists kyc_cases (
  id text primary key,
  org_id text not null,
  subject_type text not null,
  subject_id text not null,
  status text not null,
  documents_summary text not null,
  reviewer_id text,
  notes text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists risk_signals (
  id text primary key,
  org_id text not null,
  signal_type text not null,
  score integer not null,
  status text not null,
  subject_type text not null,
  subject_id text not null,
  details text not null,
  decision text,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id text primary key,
  org_id text not null,
  channel text not null,
  template text not null,
  status text not null,
  target text not null,
  provider text not null,
  failure text,
  created_at timestamptz not null default now()
);

create table if not exists alerts (
  id text primary key,
  org_id text not null,
  kind text not null,
  severity text not null,
  message text not null,
  threshold text,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists domain_events (
  id text primary key,
  org_id text not null,
  version integer not null default 1,
  type text not null,
  occurred_at timestamptz not null default now(),
  actor_type text not null,
  actor_id text,
  target_type text not null,
  target_id text not null,
  payload text not null default '{}',
  idempotency_key text not null,
  unique (org_id, idempotency_key)
);

create table if not exists health_adapters (
  key text primary key,
  state text not null,
  detail text not null,
  checked_at timestamptz not null default now()
);
