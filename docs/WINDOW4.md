# Roshoi Window 4 — Master Admin + CEO Command Center

Window 4 is the commercial operations and executive system. It is **integration-ready** for Windows 1–3 and future Window 5 Shared Core. It does **not** replace those systems.

## What is real vs simulated

| Layer | Status |
| --- | --- |
| Employee sign-in (Google, X, email/password) | Real (Better Auth) |
| Organisation, roles, permissions, invitations, audit | Real (Postgres / PGLite) |
| Branding, feature flags, settings | Real, centrally stored |
| Orders, restaurants, riders, customers, settlements | **SIMULATED DATA** until Shared Core is connected |
| Payments, SMS, WhatsApp, GPS, map provider | **NOT CONFIGURED** |
| AI | Uses xAI `grok-4.5` when `XAI_API_KEY` is present; otherwise a deterministic briefing from tables |

The amber banner is always shown while marketplace rows are simulated.

## Architecture

```
src/routes/                 UI (TanStack Start)
src/lib/roshoi/server/      createServerFn + RBAC
src/lib/roshoi/engine/      order machine, money, NL parser
src/lib/roshoi/permissions  role catalogue
migrations/0002_roshoi.sql  schema (paise integers)
```

Shared Core (Window 5) must become authoritative for users, roles, orders, restaurants, riders, customers, payments, settlements, events, notifications, audit, configuration. Window 4 talks through versioned contracts in `src/lib/roshoi/contracts.ts`.

## Auth and RBAC

1. Sign-in is required.
2. First signed-in user of an empty org is bootstrapped as **CEO**.
3. Later users match an invitation email or wait as **PENDING**.
4. Every mutation goes through `authMiddleware` → employee lookup → permission check → audit.
5. Frontend hiding is not security. Server functions deny forbidden actions.
6. Employees cannot grant privileges they do not hold (`assertNoPrivilegeEscalation`).
7. Suspended employees cannot act.

Roles are stored in `roles` / `role_permissions` and are configurable. The catalogue in `permissions.ts` is the seed, not a hard-coded runtime wall.

## Money

All cash is **integer paise**. Arithmetic uses BigInt helpers in `money.ts`. Never floating-point for stored cash.

Restaurant settlement:

```
order value
− restaurant-funded discount
− commission
− payment fee (shown)
− other permitted deduction
= restaurant settlement
```

Platform-funded discounts do **not** reduce restaurant payout. Tax is shown as customer pass-through, not a hidden deduction.

Refunds require `refund_orders`, a reason, and an idempotency key. Double submit with the same key does not pay twice. Over-refund is rejected.

Settlements are unique per `(org, party, period)`. Status can change; historical amounts are not rewritten.

## API contracts (v1)

See `ADMIN_PATHS` in `contracts.ts`. Current implementation is server functions that map 1:1 to those resources. Window 5 should expose HTTP under the same paths.

## Events

Versioned domain events in `domain_events` with `idempotency_key`. Types listed in `EVENT_TYPES`.

## AI safety

- User-initiated only, rate-limited.
- RBAC-filtered snapshot.
- Never transfers money, changes commission, bans people, or edits security settings.
- Prompt text from customers is treated as untrusted data.

## Environment (do not put secrets in the client)

Documented placeholders only. The platform injects real values on deploy. **Never commit a `.env` file in this workspace.**

| Variable | Purpose | Default here |
| --- | --- | --- |
| `DATABASE_URL` | Neon Postgres | unset → PGLite |
| `XAI_API_KEY` | CEO / employee AI | optional |
| Auth broker secrets | Better Auth | injected |
| `PAYMENT_SECRET` | payments | NOT CONFIGURED |
| `NOTIFICATION_SECRET` | SMS / WhatsApp / push | NOT CONFIGURED |
| `MAP_API_KEY` | maps | NOT CONFIGURED (schematic map) |

## Integration requirements for Window 5

1. Replace simulated marketplace tables with Shared Core adapters.
2. Keep employee RBAC or merge with Shared Core users/roles.
3. Stream domain events from Windows 1–3 into `domain_events`.
4. Payment/refund confirmation must come from the payment adapter — this UI already refuses to claim success without a server write.
5. Map adapter: implement `getMap` against OpenStreetMap / MapLibre / etc. without baking a vendor into business logic.
6. Notification adapter: only mark `SENT` after provider acknowledgement.

## Testing

`src/lib/roshoi/money.test.ts` covers paise math, settlement, refunds, order transitions, privilege escalation, NL parsing, and commission what-if (simulation does not mutate defaults).

## Folder map

- `src/routes/_app/*` — screens
- `src/components/app-shell.tsx` — employee chrome
- `src/routes/_app/ceo.tsx` — CEO command center (distinct experience)
- `docs/WINDOW4.md` — this file
