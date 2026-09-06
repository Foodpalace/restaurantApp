import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthSplash } from "@/components/auth-splash";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return <AuthSplash />;
  }
  if (user) return <Navigate to="/" />;

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({ email, password, name });
        if (err) throw new Error(err.message ?? "Could not create account");
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message ?? "Could not sign in");
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh bg-bg text-fg lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between border-r border-border p-10 lg:flex">
        <p className="font-display text-2xl">Roshoi</p>
        <div>
          <h1 className="max-w-md font-display text-4xl leading-tight tracking-tight">
            See the marketplace clearly. Act without noise.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-muted">
            Master admin and CEO command center for orders, restaurants, riders, money, and risk.
            Employees only see what their role requires.
          </p>
        </div>
        <p className="text-xs text-subtle">Guwahati · Commercial operations · Simulated marketplace until Shared Core</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-5">
          <div>
            <p className="font-display text-2xl lg:hidden">Roshoi</p>
            <h2 className="font-display text-2xl">Sign in</h2>
            <p className="mt-1 text-sm text-muted">Use your work account. First sign-in becomes CEO of this organisation.</p>
          </div>
          {authEnabled ? (
            <div className="space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                >
                  Continue with {p.label}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
          <div className="flex items-center gap-2 text-xs text-subtle">
            <span className="h-px flex-1 bg-border" />
            email
            <span className="h-px flex-1 bg-border" />
          </div>
          <form className="space-y-3" onSubmit={onEmail}>
            {mode === "up" ? (
              <label className="block text-xs text-muted">
                Full name
                <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
            ) : null}
            <label className="block text-xs text-muted">
              Work email
              <Input className="mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
            </label>
            <label className="block text-xs text-muted">
              Password
              <Input className="mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={mode === "up" ? "new-password" : "current-password"} />
            </label>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "up" ? "Create employee account" : "Sign in with email"}
            </Button>
          </form>
          <button type="button" className="text-sm text-muted underline" onClick={() => setMode(mode === "up" ? "in" : "up")}>
            {mode === "up" ? "Have an account? Sign in" : "Invited? Create an account"}
          </button>
        </div>
      </section>
    </main>
  );
}
