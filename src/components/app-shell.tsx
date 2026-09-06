import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  ClipboardList,
  Compass,
  LayoutDashboard,
  Map as MapIcon,
  Menu,
  Search,
  Shield,
  Store,
  Truck,
  Users,
  Wallet,
  Bike,
  LifeBuoy,
  Sparkles,
  Settings,
  Flag,
} from "lucide-react";
import { useMemo, useState } from "react";
import { UserButton } from "@/lib/auth/gates";
import { t } from "@/lib/roshoi/i18n";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCan, useSessionBoot, useT } from "@/components/session";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof LayoutDashboard> = {
  "/": LayoutDashboard,
  "/ceo": Compass,
  "/ai": Sparkles,
  "/search": Search,
  "/orders": ClipboardList,
  "/dispatch": Flag,
  "/map": MapIcon,
  "/support": LifeBuoy,
  "/tasks": Activity,
  "/restaurants": Store,
  "/riders": Bike,
  "/customers": Users,
  "/kyc": Shield,
  "/commerce": Bell,
  "/analytics": Activity,
  "/finance": Wallet,
  "/risk": Shield,
  "/security": Shield,
  "/audit": ClipboardList,
  "/people": Users,
  "/system": Settings,
  "/notifications": Bell,
};

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { boot, locale } = useSessionBoot();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-5" aria-label="Primary">
      {boot.nav.map((section) => (
        <div key={section.id}>
          <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-subtle">
            {t(locale, section.labelKey as never)}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const Icon = ICONS[item.to] ?? LayoutDashboard;
              const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              const label = t(locale, item.key as never);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to as "/"}
                    onClick={onNavigate}
                    title={label}
                    className={cn(
                      "flex min-h-10 items-center gap-2 rounded-md px-2 text-sm",
                      active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/70 hover:text-fg",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate whitespace-nowrap">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { boot, locale, setLocale } = useSessionBoot();
  const tr = useT();
  const can = useCan();
  const [open, setOpen] = useState(false);
  const brand = boot.branding;
  const mobileTabs = useMemo(() => {
    const preferred = ["/", "/ceo", "/orders", "/support", "/finance"].filter((p) =>
      boot.nav.some((s) => s.items.some((i) => i.to === p)),
    );
    return preferred.slice(0, 4);
  }, [boot.nav]);

  return (
    <div
      className="min-h-dvh bg-bg text-fg"
      style={{
        ["--color-bg" as never]: brand.colorBg,
        ["--color-fg" as never]: brand.colorFg,
        ["--color-accent" as never]: brand.colorAccent,
        ["--color-surface" as never]: brand.colorSurface,
      }}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:p-2">
        Skip to content
      </a>
      <div className="flex min-h-dvh">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-surface/80 lg:flex lg:flex-col">
          <div className="px-4 pt-5 pb-4">
            <p className="font-display text-xl tracking-tight">{brand.appName}</p>
            <p className="text-xs text-muted">{brand.tagline}</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-6">
            <NavList />
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-bg/90 px-3 py-2 backdrop-blur-sm lg:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
              <SheetContent>
                <p className="mb-4 font-display text-lg">{brand.appName}</p>
                <NavList onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-muted">
                {boot.session.name} · {boot.session.roleName}
                {boot.session.teamName ? ` · ${boot.session.teamName}` : ""}
              </p>
            </div>
            <span className="hidden rounded-full border border-warn/40 bg-warn/10 px-2 py-1 text-[10px] font-medium tracking-wide text-warn uppercase sm:inline">
              {tr("sim.short")}
            </span>
            {can("view_dashboard") ? (
              <Link to="/search" className="hidden min-h-10 items-center gap-1 rounded-sm border border-border px-3 text-sm text-muted md:flex">
                <Search className="size-4" /> Search
              </Link>
            ) : null}
            <select
              aria-label="Language"
              className="h-10 rounded-sm border border-border bg-elevated px-2 text-xs"
              value={locale}
              onChange={(e) => setLocale(e.target.value as typeof locale)}
            >
              <option value="en">EN</option>
              <option value="bn">বাংলা</option>
              <option value="as">অসমীয়া</option>
              <option value="hi">हिन्दी</option>
            </select>
            <UserButton />
          </header>
          <div className="border-b border-warn/30 bg-warn/10 px-3 py-2 text-xs text-fg lg:px-6">{tr("sim.banner")}</div>
          <main id="main" className="flex-1 px-3 py-5 pb-24 lg:px-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface lg:hidden" aria-label="Mobile">
        {mobileTabs.map((to) => {
          const Icon = ICONS[to] ?? LayoutDashboard;
          return (
            <Link key={to} to={to as "/"} className="flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] text-muted">
              <Icon className="size-4" />
              {to === "/" ? "Home" : to.slice(1)}
            </Link>
          );
        })}
        <button type="button" className="flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] text-muted" onClick={() => setOpen(true)}>
          <Menu className="size-4" />
          More
        </button>
      </nav>
    </div>
  );
}

export function TruckIcon() {
  return <Truck className="size-4" />;
}
