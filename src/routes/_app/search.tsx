import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getSearch } from "@/lib/roshoi/server/api";
import { PageHeader, RequirePerm } from "@/components/ui/page";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/search")({ component: () => <RequirePerm perm="view_dashboard"><SearchPage /></RequirePerm> });

const PATHS: Record<string, string> = {
  order: "/orders",
  restaurant: "/restaurants",
  rider: "/riders",
  customer: "/customers",
  employee: "/people",
};

function SearchPage() {
  const [q, setQ] = useState("");
  const list = useQuery({
    queryKey: ["search", q],
    enabled: q.trim().length >= 2,
    queryFn: async () => {
      const r = await getSearch({ data: { q } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
  });
  return (
    <div>
      <PageHeader title="Search" description="Authorized entities only. Results respect your role." />
      <Input className="mb-4 max-w-lg" placeholder="Order, restaurant, rider, customer, employee" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
      <ul className="divide-y divide-border rounded-xl border border-border">
        {(list.data?.groups ?? []).map((g) => (
          <li key={`${g.type}-${g.id}`}>
            <Link to={(PATHS[g.type] ?? "/") as "/"} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-elevated/60">
              <span>
                <span className="text-xs uppercase tracking-wider text-subtle">{g.type}</span>
                <span className="ml-2">{g.title}</span>
              </span>
              <span className="text-muted">{g.subtitle}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
