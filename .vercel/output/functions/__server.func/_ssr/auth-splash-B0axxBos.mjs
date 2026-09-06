import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-splash-B0axxBos.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function AuthSplash({ message = "Loading session…" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-dvh bg-bg text-fg lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative hidden flex-col justify-between border-r border-border p-10 lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: "Roshoi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "max-w-md font-display text-4xl leading-tight tracking-tight",
					children: "See the marketplace clearly. Act without noise."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-sm text-sm text-muted",
					children: "Master admin and CEO command center for orders, restaurants, riders, money, and risk."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "Guwahati · Commercial operations"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex items-center justify-center p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "Roshoi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted lg:hidden",
						children: "See the marketplace clearly. Act without noise."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 animate-pulse rounded-sm bg-elevated" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 animate-pulse rounded-sm bg-elevated" })
				]
			})
		})]
	});
}
//#endregion
export { useCurrentUser as n, useCurrentUserState as r, AuthSplash as t };
