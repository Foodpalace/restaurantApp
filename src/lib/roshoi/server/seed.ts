import type { Sql } from "@/lib/db";
import { DEFAULT_BRANDING, DEFAULT_FLAGS, DEFAULT_SETTINGS, ORG_ID, ZONES } from "../defaults";
import { ROLE_CATALOG } from "../permissions";
import { restaurantSettlement } from "../engine/finance";
import { mulBps } from "../money";
import { newId } from "../ids";

function iso(msOffset: number): string {
  return new Date(Date.now() + msOffset).toISOString();
}

export async function ensureSeeded(sql: Sql): Promise<void> {
  const orgs = await sql<{ id: string }>`select id from organizations where id = ${ORG_ID}`;
  if (orgs.length === 0) {
    await sql`insert into organizations (id, name) values (${ORG_ID}, ${"Roshoi"})`;
  }

  const locCount = await sql<{ n: number }>`select count(*)::int as n from locations where org_id = ${ORG_ID}`;
  if ((locCount[0]?.n ?? 0) === 0) {
    for (const z of ZONES) {
      await sql`
        insert into locations (id, org_id, name, zone_code, lat, lng)
        values (${`loc_${z.code.toLowerCase()}`}, ${ORG_ID}, ${z.name}, ${z.code}, ${z.lat}, ${z.lng})
      `;
    }
  }

  const teams = [
    ["team_ops", "Operations", "ops"],
    ["team_support", "Customer Support", "support"],
    ["team_rest", "Restaurant Ops", "restaurants"],
    ["team_rider", "Rider Ops", "riders"],
    ["team_finance", "Finance", "finance"],
    ["team_risk", "Risk", "risk"],
    ["team_dispatch", "Dispatch", "dispatch"],
    ["team_kyc", "Verification", "kyc"],
  ] as const;
  const teamCount = await sql<{ n: number }>`select count(*)::int as n from teams where org_id = ${ORG_ID}`;
  if ((teamCount[0]?.n ?? 0) === 0) {
    for (const [id, name, slug] of teams) {
      await sql`
        insert into teams (id, org_id, name, slug, location_id)
        values (${id}, ${ORG_ID}, ${name}, ${slug}, ${"loc_ganesh"})
      `;
    }
  }

  for (const role of ROLE_CATALOG) {
    const roleId = `role_${role.slug}`;
    await sql`
      insert into roles (id, org_id, slug, name, description, is_ceo, is_system)
      values (${roleId}, ${ORG_ID}, ${role.slug}, ${role.name}, ${role.description}, ${role.isCeo}, ${true})
      on conflict (org_id, slug) do nothing
    `;
    await sql`delete from role_permissions where role_id = ${roleId}`;
    for (const perm of role.permissions) {
      await sql`
        insert into role_permissions (role_id, permission_key) values (${roleId}, ${perm})
        on conflict do nothing
      `;
    }
  }

  const cfg = await sql<{ key: string }>`select key from config_kv where org_id = ${ORG_ID} and key = ${"branding"}`;
  if (cfg.length === 0) {
    await sql`
      insert into config_kv (org_id, key, value) values
      (${ORG_ID}, ${"branding"}, ${JSON.stringify(DEFAULT_BRANDING)}),
      (${ORG_ID}, ${"feature_flags"}, ${JSON.stringify(DEFAULT_FLAGS)}),
      (${ORG_ID}, ${"settings"}, ${JSON.stringify(DEFAULT_SETTINGS)}),
      (${ORG_ID}, ${"data_mode"}, ${JSON.stringify({ mode: "SIMULATED" })})
    `;
  }

  const restCount = await sql<{ n: number }>`select count(*)::int as n from restaurants where org_id = ${ORG_ID}`;
  if ((restCount[0]?.n ?? 0) > 0) return;

  await seedMarketplace(sql);
}

async function seedMarketplace(sql: Sql): Promise<void> {
  const restaurants = [
    { id: "rst_boroxai", name: "Boroxai Kitchen", cuisine: "Assamese", status: "ACTIVE", zone: "PANBAZAR", commission: 1000, kyc: "VERIFIED", step: "ACTIVE", missing: "", lat: 26.183, lng: 91.745, prep: 16 },
    { id: "rst_brahma", name: "Brahmaputra Grill", cuisine: "North Indian", status: "ACTIVE", zone: "UZAN", commission: 1000, kyc: "VERIFIED", step: "ACTIVE", missing: "", lat: 26.187, lng: 91.752, prep: 22 },
    { id: "rst_tea37", name: "Tea Stall 37", cuisine: "Cafe", status: "ACTIVE", zone: "FANCY", commission: 800, kyc: "VERIFIED", step: "ACTIVE", missing: "", lat: 26.181, lng: 91.74, prep: 8 },
    { id: "rst_silk", name: "Silk Route Dumplings", cuisine: "Tibetan", status: "ACTIVE", zone: "GANESH", commission: 1200, kyc: "VERIFIED", step: "ACTIVE", missing: "", lat: 26.143, lng: 91.792, prep: 18 },
    { id: "rst_kahili", name: "Kahilipara Biryani House", cuisine: "Biryani", status: "ACTIVE", zone: "KAHILI", commission: 1000, kyc: "VERIFIED", step: "ACTIVE", missing: "", lat: 26.144, lng: 91.77, prep: 28 },
    { id: "rst_uzanfish", name: "Uzan Bazar Fish", cuisine: "Seafood", status: "PAUSED", zone: "UZAN", commission: 1000, kyc: "VERIFIED", step: "ACTIVE", missing: "", lat: 26.186, lng: 91.75, prep: 24 },
    { id: "rst_panbakery", name: "Panbazar Bakery", cuisine: "Bakery", status: "UNDER_REVIEW", zone: "PANBAZAR", commission: 800, kyc: "UNDER_REVIEW", step: "VERIFICATION", missing: "FSSAI copy", lat: 26.182, lng: 91.744, prep: 12 },
    { id: "rst_dosa", name: "Beltola Dosa Corner", cuisine: "South Indian", status: "APPLIED", zone: "BELTOLA", commission: 1000, kyc: "SUBMITTED", step: "DOCUMENTS", missing: "Owner ID, bank proof", lat: 26.12, lng: 91.8, prep: 14 },
    { id: "rst_zoopizza", name: "Zoo Road Oven", cuisine: "Pizza", status: "ACTIVE", zone: "ZOO", commission: 1200, kyc: "VERIFIED", step: "ACTIVE", missing: "", lat: 26.166, lng: 91.78, prep: 20 },
    { id: "rst_sixmile", name: "Six Mile Thali", cuisine: "Assamese", status: "SUSPENDED", zone: "SIXMILE", commission: 1000, kyc: "SUSPENDED", step: "ACTIVE", missing: "", lat: 26.135, lng: 91.82, prep: 18 },
  ];
  for (const r of restaurants) {
    await sql`
      insert into restaurants (
        id, org_id, name, cuisine, status, zone_code, commission_bps, kyc_status, onboarding_step,
        missing_documents, lat, lng, avg_prep_minutes
      ) values (
        ${r.id}, ${ORG_ID}, ${r.name}, ${r.cuisine}, ${r.status}, ${r.zone}, ${r.commission},
        ${r.kyc}, ${r.step}, ${r.missing}, ${r.lat}, ${r.lng}, ${r.prep}
      )
    `;
  }

  const riders = [
    { id: "rdr_arun", name: "Arun Kalita", status: "ONLINE", vehicle: "Bike", zone: "GANESH", kyc: "VERIFIED", lat: 26.145, lng: 91.79, earn: 184000, cod: 2400, acc: 9400, del: 126 },
    { id: "rdr_mina", name: "Mina Das", status: "BUSY", vehicle: "Scooter", zone: "PANBAZAR", kyc: "VERIFIED", lat: 26.182, lng: 91.746, earn: 162500, cod: 0, acc: 9100, del: 98 },
    { id: "rdr_rahul", name: "Rahul Boro", status: "ONLINE", vehicle: "Bike", zone: "ZOO", kyc: "VERIFIED", lat: 26.164, lng: 91.778, earn: 99000, cod: 8500, acc: 8800, del: 71 },
    { id: "rdr_sita", name: "Sita Pegu", status: "OFFLINE", vehicle: "Scooter", zone: "BELTOLA", kyc: "VERIFIED", lat: 26.122, lng: 91.798, earn: 141000, cod: 0, acc: 9300, del: 110 },
    { id: "rdr_jitu", name: "Jitu Saikia", status: "ONLINE", vehicle: "Bike", zone: "SIXMILE", kyc: "VERIFIED", lat: 26.136, lng: 91.818, earn: 76000, cod: 1200, acc: 8600, del: 54 },
    { id: "rdr_niva", name: "Niva Hazarika", status: "BUSY", vehicle: "Scooter", zone: "KAHILI", kyc: "VERIFIED", lat: 26.146, lng: 91.772, earn: 121000, cod: 0, acc: 9000, del: 88 },
    { id: "rdr_paul", name: "Paul Deka", status: "UNDER_REVIEW", vehicle: "Bike", zone: "FANCY", kyc: "UNDER_REVIEW", lat: 26.18, lng: 91.741, earn: 0, cod: 0, acc: 0, del: 0 },
    { id: "rdr_rita", name: "Rita Narzary", status: "SUSPENDED", vehicle: "Bike", zone: "UZAN", kyc: "SUSPENDED", lat: 26.185, lng: 91.751, earn: 45000, cod: 18000, acc: 7200, del: 40 },
    { id: "rdr_ajay", name: "Ajay Teron", status: "ONLINE", vehicle: "Bike", zone: "GANESH", kyc: "VERIFIED", lat: 26.141, lng: 91.795, earn: 88000, cod: 0, acc: 8900, del: 62 },
    { id: "rdr_kavya", name: "Kavya Baruah", status: "OFFLINE", vehicle: "Scooter", zone: "PANBAZAR", kyc: "VERIFIED", lat: 26.184, lng: 91.743, earn: 132000, cod: 0, acc: 9500, del: 101 },
  ];
  for (const r of riders) {
    await sql`
      insert into riders (
        id, org_id, name, status, vehicle, zone_code, kyc_status, lat, lng,
        earnings_paise, cod_balance_paise, acceptance_bps, deliveries
      ) values (
        ${r.id}, ${ORG_ID}, ${r.name}, ${r.status}, ${r.vehicle}, ${r.zone}, ${r.kyc},
        ${r.lat}, ${r.lng}, ${r.earn}, ${r.cod}, ${r.acc}, ${r.del}
      )
    `;
  }

  const customers = [
    ["cus_ananya", "Ananya Sharma", "98****2101", "an****@mail.com", "ACTIVE", "GANESH", 420, 18, 612000, 8],
    ["cus_vikram", "Vikram Joshi", "97****4412", "vi****@mail.com", "ACTIVE", "PANBAZAR", 210, 9, 288000, 12],
    ["cus_lina", "Lina Choudhury", "96****8810", "li****@mail.com", "ACTIVE", "ZOO", 80, 4, 96000, 5],
    ["cus_farhan", "Farhan Ali", "95****3320", "fa****@mail.com", "RESTRICTED", "FANCY", 40, 11, 410000, 62],
    ["cus_meera", "Meera Kalita", "94****1099", "me****@mail.com", "ACTIVE", "BELTOLA", 150, 7, 198000, 4],
    ["cus_rohan", "Rohan Das", "93****7741", "ro****@mail.com", "ACTIVE", "SIXMILE", 60, 3, 72000, 3],
    ["cus_priya", "Priya Bora", "92****5528", "pr****@mail.com", "ACTIVE", "KAHILI", 310, 14, 490000, 6],
    ["cus_amit", "Amit Dutta", "91****6603", "am****@mail.com", "SUSPENDED", "UZAN", 0, 2, 18000, 80],
    ["cus_neha", "Neha Singh", "90****2194", "ne****@mail.com", "ACTIVE", "GANESH", 95, 5, 140000, 7],
    ["cus_john", "John Sangma", "89****4419", "jo****@mail.com", "ACTIVE", "ZOO", 20, 1, 22000, 2],
    ["cus_rima", "Rima Devi", "88****9088", "ri****@mail.com", "ACTIVE", "PANBAZAR", 180, 8, 255000, 9],
    ["cus_sanjay", "Sanjay Pal", "87****1150", "sa****@mail.com", "DEACTIVATED", "SIXMILE", 0, 0, 0, 0],
    ["cus_tanya", "Tanya Roy", "86****7732", "ta****@mail.com", "ACTIVE", "BELTOLA", 55, 2, 48000, 3],
    ["cus_dev", "Dev Mahanta", "85****2291", "de****@mail.com", "ACTIVE", "KAHILI", 240, 12, 401000, 10],
    ["cus_isha", "Isha Rahman", "84****6677", "is****@mail.com", "ACTIVE", "FANCY", 70, 3, 81000, 4],
    ["cus_kiran", "Kiran Pegu", "83****3344", "ki****@mail.com", "ACTIVE", "GANESH", 15, 1, 19000, 1],
  ] as const;
  for (const c of customers) {
    await sql`
      insert into customers (
        id, org_id, display_name, phone_masked, email_masked, status, zone_code,
        loyalty_points, order_count, lifetime_gmv_paise, risk_score
      ) values (
        ${c[0]}, ${ORG_ID}, ${c[1]}, ${c[2]}, ${c[3]}, ${c[4]}, ${c[5]},
        ${c[6]}, ${c[7]}, ${c[8]}, ${c[9]}
      )
    `;
  }

  const invited = [
    ["emp_ops", "priya.ops@roshoi.app", "Priya Sharma", "operations_manager", "team_ops"],
    ["emp_cs", "arjun.cs@roshoi.app", "Arjun Sen", "customer_support", "team_support"],
    ["emp_fin", "nisha.fin@roshoi.app", "Nisha Rao", "finance", "team_finance"],
    ["emp_mkt", "kabir.mkt@roshoi.app", "Kabir Khan", "marketing", "team_ops"],
    ["emp_kyc", "leena.kyc@roshoi.app", "Leena Deka", "kyc", "team_kyc"],
    ["emp_risk", "omar.risk@roshoi.app", "Omar Hussain", "fraud_risk", "team_risk"],
    ["emp_disp", "tara.disp@roshoi.app", "Tara Gogoi", "dispatch_operator", "team_dispatch"],
    ["emp_rst", "vivek.rst@roshoi.app", "Vivek Nath", "restaurant_onboarding", "team_rest"],
    ["emp_rid", "sana.rid@roshoi.app", "Sana Ahmed", "rider_operations", "team_rider"],
    ["emp_an", "dev.an@roshoi.app", "Dev Analytica", "analyst", "team_ops"],
  ] as const;
  for (const e of invited) {
    await sql`
      insert into employees (
        id, org_id, email, name, role_id, team_id, location_id, status, invited_at
      ) values (
        ${e[0]}, ${ORG_ID}, ${e[1]}, ${e[2]}, ${`role_${e[3]}`}, ${e[4]}, ${"loc_ganesh"},
        ${"INVITED"}, ${iso(-86400000)}
      )
    `;
  }

  const activeRestaurants = restaurants.filter((r) => r.status === "ACTIVE");
  const activeCustomers = customers.filter((c) => c[4] === "ACTIVE");
  const activeRiders = riders.filter((r) => r.status === "ONLINE" || r.status === "BUSY" || r.status === "OFFLINE");
  const statusesToday = [
    "PLACED",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "RIDER_ASSIGNED",
    "PICKED_UP",
    "ON_THE_WAY",
    "ARRIVED",
    "DELIVERED",
    "DELIVERED",
    "DELIVERED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ];

  let ordN = 1001;
  const mkOrder = async (opts: {
    hoursAgo: number;
    status: string;
    rest: (typeof restaurants)[number];
    customer: (typeof customers)[number];
    riderId: string | null;
    value: number;
    delay: number;
  }) => {
    const id = `ord_${ordN++}`;
    const restDisc = opts.value > 40000 ? 1500 : 0;
    const platDisc = opts.status === "REFUNDED" ? 0 : 800;
    const breakdown = restaurantSettlement({
      orderValuePaise: opts.value,
      restaurantDiscountPaise: restDisc,
      platformDiscountPaise: platDisc,
      commissionBps: opts.rest.commission,
      paymentFeePaise: mulBps(opts.value, 180),
      taxPaise: mulBps(opts.value, 500),
      otherDeductionPaise: 0,
    });
    const payStatus =
      opts.status === "CANCELLED" || opts.status === "FAILED"
        ? "FAILED"
        : opts.status === "REFUNDED"
          ? "REFUNDED"
          : opts.status === "PLACED"
            ? "PENDING"
            : "PAID";
    const placed = iso(-opts.hoursAgo * 3600_000);
    const deliveryFee = 3500;
    const customerFee = 500;
    const riderPay = opts.riderId ? 4200 : 0;
    const refunded = opts.status === "REFUNDED" ? opts.value : 0;
    await sql`
      insert into orders (
        id, org_id, customer_id, restaurant_id, rider_id, status, payment_status, placed_at,
        order_value_paise, restaurant_discount_paise, platform_discount_paise, delivery_fee_paise,
        customer_fee_paise, commission_paise, payment_fee_paise, tax_paise, rider_payout_paise,
        other_deduction_paise, restaurant_settlement_paise, refunded_paise, items_json, delay_minutes
      ) values (
        ${id}, ${ORG_ID}, ${opts.customer[0]}, ${opts.rest.id}, ${opts.riderId}, ${opts.status}, ${payStatus}, ${placed},
        ${opts.value}, ${restDisc}, ${platDisc}, ${deliveryFee}, ${customerFee}, ${breakdown.commissionPaise},
        ${breakdown.paymentFeePaise}, ${breakdown.taxPaise}, ${riderPay}, ${0}, ${breakdown.restaurantSettlementPaise},
        ${refunded}, ${JSON.stringify([{ name: opts.rest.cuisine + " plate", qty: 1, paise: opts.value }])}, ${opts.delay}
      )
    `;
    await sql`
      insert into order_events (id, org_id, order_id, at, actor_type, actor_id, from_status, to_status, reason)
      values (${newId("oev")}, ${ORG_ID}, ${id}, ${placed}, ${"customer"}, ${opts.customer[0]}, ${null}, ${"PLACED"}, ${"Order placed"})
    `;
    if (opts.status !== "PLACED") {
      await sql`
        insert into order_events (id, org_id, order_id, at, actor_type, actor_id, from_status, to_status, reason)
        values (${newId("oev")}, ${ORG_ID}, ${id}, ${iso(-opts.hoursAgo * 3600_000 + 6 * 60_000)}, ${"restaurant"}, ${opts.rest.id}, ${"PLACED"}, ${opts.status === "CONFIRMED" ? "CONFIRMED" : "CONFIRMED"}, ${null})
      `;
    }
    await sql`
      insert into domain_events (
        id, org_id, type, actor_type, actor_id, target_type, target_id, payload, idempotency_key
      ) values (
        ${newId("evt")}, ${ORG_ID}, ${"ORDER_CREATED"}, ${"customer"}, ${opts.customer[0]}, ${"order"}, ${id},
        ${JSON.stringify({ status: opts.status })}, ${`seed-${id}`}
      )
    `;
    if (opts.status === "REFUNDED") {
      await sql`
        insert into refunds (id, org_id, order_id, amount_paise, status, reason, requested_by, idempotency_key)
        values (${newId("rfd")}, ${ORG_ID}, ${id}, ${opts.value}, ${"COMPLETED"}, ${"Customer complaint — simulated"}, ${"emp_cs"}, ${`seed-refund-${id}`})
      `;
    }
    return id;
  };

  for (let i = 0; i < statusesToday.length; i++) {
    const rest = activeRestaurants[i % activeRestaurants.length]!;
    const customer = activeCustomers[i % activeCustomers.length]!;
    const status = statusesToday[i]!;
    const needRider = ["RIDER_ASSIGNED", "PICKED_UP", "ON_THE_WAY", "ARRIVED", "DELIVERED", "REFUNDED"].includes(status);
    const rider = needRider ? activeRiders[i % activeRiders.length]!.id : null;
    const id = await mkOrder({
      hoursAgo: (i % 8) + 0.2,
      status,
      rest,
      customer,
      riderId: rider,
      value: 28000 + (i % 7) * 4500,
      delay: i === 4 ? 52 : i === 5 ? 38 : 8 + (i % 5),
    });
    if (status === "RIDER_ASSIGNED" || status === "PICKED_UP" || status === "ON_THE_WAY") {
      await sql`update riders set active_order_id = ${id}, status = ${"BUSY"} where id = ${rider}`;
    }
  }

  for (let d = 1; d <= 14; d++) {
    for (let j = 0; j < 3; j++) {
      const rest = activeRestaurants[(d + j) % activeRestaurants.length]!;
      const customer = activeCustomers[(d + j) % activeCustomers.length]!;
      const rider = activeRiders[(d + j) % activeRiders.length]!.id;
      const cancelled = d === 3 && j === 1;
      await mkOrder({
        hoursAgo: d * 24 + j * 3,
        status: cancelled ? "CANCELLED" : "DELIVERED",
        rest,
        customer,
        riderId: cancelled ? null : rider,
        value: 25000 + ((d * 3 + j) % 9) * 3500,
        delay: 10 + (d % 6),
      });
    }
  }

  const periodStart = new Date();
  periodStart.setUTCDate(1);
  const periodEnd = new Date();
  for (const r of activeRestaurants) {
    const rows = await sql<{ gmv: number; comm: number; pay: number }>`
      select coalesce(sum(order_value_paise),0)::int as gmv,
             coalesce(sum(commission_paise),0)::int as comm,
             coalesce(sum(restaurant_settlement_paise),0)::int as pay
      from orders
      where restaurant_id = ${r.id} and status in ('DELIVERED','REFUNDED')
    `;
    const row = rows[0]!;
    await sql`
      insert into settlements (
        id, org_id, party_type, party_id, period_start, period_end,
        gmv_paise, commission_paise, payout_paise, status
      ) values (
        ${`stl_${r.id}`}, ${ORG_ID}, ${"restaurant"}, ${r.id},
        ${periodStart.toISOString().slice(0, 10)}, ${periodEnd.toISOString().slice(0, 10)},
        ${row.gmv}, ${row.comm}, ${row.pay},
        ${r.id === "rst_kahili" ? "FLAGGED" : "PENDING_REVIEW"}
      )
    `;
  }
  for (const r of riders.filter((x) => x.kyc === "VERIFIED")) {
    await sql`
      insert into settlements (
        id, org_id, party_type, party_id, period_start, period_end,
        gmv_paise, commission_paise, payout_paise, status
      ) values (
        ${`stl_${r.id}`}, ${ORG_ID}, ${"rider"}, ${r.id},
        ${periodStart.toISOString().slice(0, 10)}, ${periodEnd.toISOString().slice(0, 10)},
        ${0}, ${0}, ${r.earn}, ${"PENDING_REVIEW"}
      )
    `;
  }

  const tickets: Array<[string, string, string, string, string, string, string | null, string | null]> = [
    ["tkt_1", "ORDER", "OPEN", "HIGH", "Late delivery — order still on the way", "cus_ananya", "ord_1005", "team_support"],
    ["tkt_2", "REFUND", "IN_PROGRESS", "HIGH", "Refund not visible in bank", "cus_vikram", "ord_1014", "team_support"],
    ["tkt_3", "RESTAURANT", "ASSIGNED", "MED", "Menu item out of stock repeatedly", "cus_priya", null, "team_rest"],
    ["tkt_4", "RIDER", "WAITING", "MED", "Rider unreachable at pickup", "cus_meera", null, "team_rider"],
    ["tkt_5", "PAYMENT", "OPEN", "HIGH", "Double charge reported", "cus_farhan", null, "team_finance"],
    ["tkt_6", "ACCOUNT", "RESOLVED", "LOW", "Update registered phone", "cus_lina", null, "team_support"],
    ["tkt_7", "PROMOTION", "CLOSED", "LOW", "Coupon not applying", "cus_neha", null, "team_support"],
    ["tkt_8", "DELIVERY", "OPEN", "HIGH", "Wrong order received", "cus_dev", null, "team_support"],
  ];
  for (const t of tickets) {
    await sql`
      insert into tickets (
        id, org_id, category, status, priority, subject, customer_id, order_id, team_id, sla_due
      ) values (
        ${t[0]}, ${ORG_ID}, ${t[1]}, ${t[2]}, ${t[3]}, ${t[4]}, ${t[5]}, ${t[6]}, ${t[7]},
        ${iso(t[3] === "HIGH" ? 20 * 60_000 : 2 * 3600_000)}
      )
    `;
    await sql`
      insert into ticket_messages (id, ticket_id, author_type, author_id, body)
      values (${newId("msg")}, ${t[0]}, ${"customer"}, ${t[5]}, ${t[4]})
    `;
  }

  const taskRows = [
    ["tsk_1", "Verify Panbazar Bakery documents", "kyc", "OPEN", "HIGH", "team_kyc", "restaurant", "rst_panbakery"],
    ["tsk_2", "Call Beltola Dosa Corner for missing ID", "onboarding", "OPEN", "MED", "team_rest", "restaurant", "rst_dosa"],
    ["tsk_3", "Review rider Paul Deka KYC", "kyc", "OPEN", "MED", "team_kyc", "rider", "rdr_paul"],
    ["tsk_4", "Investigate refund on tkt_2", "refund", "OPEN", "HIGH", "team_finance", "ticket", "tkt_2"],
    ["tsk_5", "Review COD mismatch on Rita Narzary", "risk", "OPEN", "HIGH", "team_risk", "rider", "rdr_rita"],
    ["tsk_6", "Assign unassigned lunch orders", "dispatch", "OPEN", "HIGH", "team_dispatch", "order", "ord_1001"],
  ] as const;
  for (const t of taskRows) {
    await sql`
      insert into tasks (id, org_id, title, kind, status, priority, due_at, team_id, target_type, target_id)
      values (${t[0]}, ${ORG_ID}, ${t[1]}, ${t[2]}, ${t[3]}, ${t[4]}, ${iso(4 * 3600_000)}, ${t[5]}, ${t[6]}, ${t[7]})
    `;
  }

  await sql`
    insert into promotions (
      id, org_id, name, promo_type, discount_bps, discount_paise, min_order_paise, funding,
      budget_paise, spent_paise, starts_at, ends_at, eligibility, max_discount_paise, status
    ) values
    (${"pro_first"}, ${ORG_ID}, ${"First order 20%"}, ${"percentage"}, ${2000}, ${null}, ${20000}, ${"platform"},
     ${200000}, ${54000}, ${iso(-7 * 86400000)}, ${iso(14 * 86400000)}, ${"first-order"}, ${8000}, ${"ACTIVE"}),
    (${"pro_tea"}, ${ORG_ID}, ${"Tea Stall 37 ₹50 off"}, ${"fixed"}, ${null}, ${5000}, ${15000}, ${"restaurant"},
     ${80000}, ${22000}, ${iso(-2 * 86400000)}, ${iso(5 * 86400000)}, ${"restaurant-specific"}, ${5000}, ${"ACTIVE"}),
    (${"pro_rain"}, ${ORG_ID}, ${"Rainy day free delivery"}, ${"fixed"}, ${null}, ${3500}, ${25000}, ${"shared"},
     ${120000}, ${91000}, ${iso(-1 * 86400000)}, ${iso(2 * 86400000)}, ${"zone-specific"}, ${3500}, ${"ACTIVE"}),
    (${"pro_old"}, ${ORG_ID}, ${"Holi leftover"}, ${"percentage"}, ${1500}, ${null}, ${30000}, ${"platform"},
     ${150000}, ${150000}, ${iso(-40 * 86400000)}, ${iso(-20 * 86400000)}, ${"all"}, ${6000}, ${"ENDED"})
  `;

  await sql`
    insert into loyalty_rules (id, org_id, name, points_per_rupee, expiry_days, tier_json, status)
    values (
      ${"loy_core"}, ${ORG_ID}, ${"Roshoi Stamps"}, ${1}, ${180},
      ${JSON.stringify({ tiers: ["Leaf", "River", "Hill"], stamps: 6 })},
      ${"ACTIVE"}
    )
  `;

  await sql`
    insert into campaigns (id, org_id, name, channel, status, segment, budget_paise, spent_paise, starts_at, ends_at)
    values
    (${"cmp_push1"}, ${ORG_ID}, ${"Lunch push — Ganeshguri"}, ${"push"}, ${"DRAFT"}, ${"ganeshguri-repeat"}, ${60000}, ${0}, ${iso(3600_000)}, ${iso(2 * 86400000)}),
    (${"cmp_banner"}, ${ORG_ID}, ${"Home banner — Assamese week"}, ${"in-app"}, ${"LIVE"}, ${"all-active"}, ${40000}, ${12000}, ${iso(-86400000)}, ${iso(6 * 86400000)})
  `;

  await sql`
    insert into kyc_cases (id, org_id, subject_type, subject_id, status, documents_summary, notes)
    values
    (${"kyc_rst_pan"}, ${ORG_ID}, ${"restaurant"}, ${"rst_panbakery"}, ${"UNDER_REVIEW"}, ${"FSSAI pending; GST present"}, ${""}),
    (${"kyc_rst_dosa"}, ${ORG_ID}, ${"restaurant"}, ${"rst_dosa"}, ${"SUBMITTED"}, ${"Owner ID missing"}, ${""}),
    (${"kyc_rdr_paul"}, ${ORG_ID}, ${"rider"}, ${"rdr_paul"}, ${"UNDER_REVIEW"}, ${"Aadhaar + DL uploaded"}, ${""}),
    (${"kyc_rdr_rita"}, ${ORG_ID}, ${"rider"}, ${"rdr_rita"}, ${"SUSPENDED"}, ${"COD mismatch investigation"}, ${"Do not auto-ban"})
  `;

  await sql`
    insert into risk_signals (id, org_id, signal_type, score, status, subject_type, subject_id, details)
    values
    (${"rsk_cod1"}, ${ORG_ID}, ${"COD_MISMATCH"}, ${78}, ${"REVIEW"}, ${"rider"}, ${"rdr_rita"}, ${"COD balance higher than expected deliveries"}),
    (${"rsk_ref1"}, ${ORG_ID}, ${"UNUSUAL_REFUND"}, ${64}, ${"REVIEW"}, ${"customer"}, ${"cus_farhan"}, ${"Multiple refund requests in 10 days"}),
    (${"rsk_coupon"}, ${ORG_ID}, ${"COUPON_ABUSE"}, ${55}, ${"OPEN"}, ${"customer"}, ${"cus_farhan"}, ${"First-order coupon reused across devices — unverified"}),
    (${"rsk_gps"}, ${ORG_ID}, ${"GPS_ANOMALY"}, ${41}, ${"OPEN"}, ${"rider"}, ${"rdr_jitu"}, ${"Jump larger than travel-time window — needs review"})
  `;

  await sql`
    insert into notifications (id, org_id, channel, template, status, target, provider, failure)
    values
    (${"ntf_1"}, ${ORG_ID}, ${"push"}, ${"order.delayed"}, ${"FAILED"}, ${"cus_ananya"}, ${"NOT_CONFIGURED"}, ${"Provider not configured"}),
    (${"ntf_2"}, ${ORG_ID}, ${"in-app"}, ${"ticket.updated"}, ${"QUEUED"}, ${"cus_vikram"}, ${"in-app"}, ${null}),
    (${"ntf_3"}, ${ORG_ID}, ${"email"}, ${"settlement.ready"}, ${"QUEUED"}, ${"rst_boroxai"}, ${"NOT_CONFIGURED"}, ${"Provider not configured"})
  `;

  await sql`
    insert into alerts (id, org_id, kind, severity, message, threshold, status)
    values
    (${"al_rider"}, ${ORG_ID}, ${"rider_shortage"}, ${"HIGH"}, ${"Ganeshguri online riders below lunch coverage"}, ${"min_online=6"}, ${"OPEN"}),
    (${"al_refund"}, ${ORG_ID}, ${"high_refund_rate"}, ${"MED"}, ${"Refund rate above 3% in the last 24 hours"}, ${"3%"}, ${"OPEN"}),
    (${"al_rest"}, ${ORG_ID}, ${"restaurant_outage"}, ${"MED"}, ${"Uzan Bazar Fish is paused during dinner window"}, ${null}, ${"OPEN"}),
    (${"al_pay"}, ${ORG_ID}, ${"payment_adapter"}, ${"LOW"}, ${"Payment provider is not configured"}, ${null}, ${"OPEN"})
  `;

  const adapters: Array<[string, string, string]> = [
    ["api", "HEALTHY", "Admin API process is serving requests"],
    ["database", "HEALTHY", "Query succeeded"],
    ["authentication", "HEALTHY", "Better Auth is enabled"],
    ["notifications", "NOT_CONFIGURED", "Notification provider is not configured"],
    ["payment", "NOT_CONFIGURED", "Payment adapter is not configured"],
    ["map", "NOT_CONFIGURED", "Using schematic zone map until a map provider is configured"],
    ["ai", process.env.XAI_API_KEY ? "HEALTHY" : "NOT_CONFIGURED", process.env.XAI_API_KEY ? "xAI grok-4.5 available" : "XAI_API_KEY is not configured"],
    ["storage", "NOT_CONFIGURED", "Object storage is not configured"],
    ["background_jobs", "NOT_CONFIGURED", "No job runner is configured"],
  ];
  for (const a of adapters) {
    await sql`
      insert into health_adapters (key, state, detail) values (${a[0]}, ${a[1]}, ${a[2]})
      on conflict (key) do update set state = excluded.state, detail = excluded.detail, checked_at = now()
    `;
  }
}
