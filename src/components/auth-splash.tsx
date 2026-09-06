export function AuthSplash({ message = "Loading session…" }: { message?: string }) {
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
          </p>
        </div>
        <p className="text-xs text-subtle">Guwahati · Commercial operations</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-3">
          <p className="font-display text-2xl">Roshoi</p>
          <h2 className="font-display text-2xl">Sign in</h2>
          <p className="text-sm text-muted lg:hidden">See the marketplace clearly. Act without noise.</p>
          <p className="text-sm text-muted">{message}</p>
          <div className="h-10 animate-pulse rounded-sm bg-elevated" />
          <div className="h-10 animate-pulse rounded-sm bg-elevated" />
        </div>
      </section>
    </main>
  );
}
