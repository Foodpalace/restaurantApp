import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getBootstrap } from "@/lib/roshoi/server/api";
import { AppShell } from "@/components/app-shell";
import { AuthSplash } from "@/components/auth-splash";
import { SessionProvider, type Bootstrap } from "@/components/session";
import type { Locale } from "@/lib/roshoi/i18n";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  const { user, isPending } = useCurrentUserState();
  const [boot, setBoot] = useState<Bootstrap | null>(null);
  const [err, setErr] = useState<{ code: string; error: string } | null>(null);
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void getBootstrap()
      .then((r) => {
        if (cancelled) return;
        if (!r.ok) setErr({ code: r.code, error: r.error });
        else {
          setBoot(r.data);
          setLocale(r.data.branding.locale);
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : "Could not load your workspace.";
        setErr({ code: message === "Unauthorized" ? "AUTH" : "ERROR", error: message === "Unauthorized" ? "Unauthorized" : "We couldn't load your workspace. Please retry." });
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isPending) {
    return <AuthSplash message="Checking your session." />;
  }
  if (!user) return <RedirectToSignIn />;
  if (err?.code === "AUTH") return <RedirectToSignIn />;
  if (err?.code === "PENDING") {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
        <div className="max-w-md">
          <h1 className="font-display text-2xl">Waiting for activation</h1>
          <p className="mt-2 text-sm text-muted">{err.error}</p>
        </div>
      </main>
    );
  }
  if (err?.code === "SUSPENDED") {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
        <div className="max-w-md">
          <h1 className="font-display text-2xl">Account suspended</h1>
          <p className="mt-2 text-sm text-muted">{err.error}</p>
        </div>
      </main>
    );
  }
  if (err) {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
        <div>
          <p className="text-sm">{err.error}</p>
          <button type="button" className="mt-3 underline" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </main>
    );
  }
  if (!boot) {
    return <AuthSplash message="Preparing your workspace." />;
  }

  return (
    <SessionProvider boot={boot} locale={locale} setLocale={setLocale}>
      <AppShell>
        <Outlet />
      </AppShell>
    </SessionProvider>
  );
}
