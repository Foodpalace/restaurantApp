import { createContext, useContext } from "react";
import type { BrandingConfig, EmployeeSession, FeatureFlag } from "@/lib/roshoi/types";
import type { NavSection } from "@/lib/roshoi/nav";
import { t, type Locale } from "@/lib/roshoi/i18n";

export type Bootstrap = {
  session: EmployeeSession;
  branding: BrandingConfig;
  flags: FeatureFlag[];
  nav: NavSection[];
  dataMode: "SIMULATED";
};

const Ctx = createContext<{
  boot: Bootstrap;
  locale: Locale;
  setLocale: (l: Locale) => void;
} | null>(null);

export function SessionProvider({
  boot,
  locale,
  setLocale,
  children,
}: {
  boot: Bootstrap;
  locale: Locale;
  setLocale: (l: Locale) => void;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={{ boot, locale, setLocale }}>{children}</Ctx.Provider>;
}

export function useSessionBoot() {
  const v = useContext(Ctx);
  if (!v) throw new Error("Session missing");
  return v;
}

export function useT() {
  const { locale } = useSessionBoot();
  return (key: Parameters<typeof t>[1]) => t(locale, key);
}

/** Stable permission checker. Call once at the top of a component — never inside conditions or loops. */
export function useCan() {
  const { boot } = useSessionBoot();
  const perms = boot.session.permissions;
  return (key: string) => perms.includes(key as never);
}
