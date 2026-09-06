import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as auth } from "./server-B8BlpmjO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DOOV-cCI.js
var router_DOOV_cCI_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-Ui1MKBDI.css";
var APP_NAME = "Roshoi";
var queryClient = new QueryClient({ defaultOptions: { queries: {
	retry: 1,
	refetchOnWindowFocus: false
} } });
var Route$25 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0B0C0E"
			},
			{
				name: "description",
				content: "Roshoi master admin and CEO command center"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
				client: queryClient,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					theme: "dark",
					position: "bottom-right"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$23 = () => import("../_app-CfvbOn3O.mjs");
var Route$24 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./login-0S4qGQy0.mjs");
var Route$23 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("../_app-DlODgkXw.mjs");
var Route$22 = createFileRoute("/_app/")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./ai-D6S5d9lT.mjs");
var Route$21 = createFileRoute("/_app/ai")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./analytics-bpH21umq.mjs");
var Route$20 = createFileRoute("/_app/analytics")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./audit-CFXoubKX.mjs");
var Route$19 = createFileRoute("/_app/audit")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./ceo--w4I_k3u.mjs");
var Route$18 = createFileRoute("/_app/ceo")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./commerce-C4kIg1MX.mjs");
var Route$17 = createFileRoute("/_app/commerce")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./customers-Besge28W.mjs");
var Route$16 = createFileRoute("/_app/customers")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./dispatch-BqdEWQqn.mjs");
var Route$15 = createFileRoute("/_app/dispatch")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./finance-BZD6BwvR.mjs");
var Route$14 = createFileRoute("/_app/finance")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./kyc-C5_72pkr.mjs");
var Route$13 = createFileRoute("/_app/kyc")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./map-CaIvE2zZ.mjs");
var Route$12 = createFileRoute("/_app/map")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./notifications-xENdAsHX.mjs");
var Route$11 = createFileRoute("/_app/notifications")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./orders-D2Vhf5cM.mjs");
var Route$10 = createFileRoute("/_app/orders")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./people-BPrAyvR9.mjs");
var Route$9 = createFileRoute("/_app/people")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./restaurants-C3AqSZar.mjs");
var Route$8 = createFileRoute("/_app/restaurants")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./riders-B4BM2DIC.mjs");
var Route$7 = createFileRoute("/_app/riders")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./risk-74SoUaNF.mjs");
var Route$6 = createFileRoute("/_app/risk")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./search-VmcnMENF.mjs");
var Route$5 = createFileRoute("/_app/search")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./security-EZ6AAbwv.mjs");
var Route$4 = createFileRoute("/_app/security")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./support-D8Pl4PvU.mjs");
var Route$3 = createFileRoute("/_app/support")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./system-BcU3lRtG.mjs");
var Route$2 = createFileRoute("/_app/system")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./tasks-C25gJZjI.mjs");
var Route$1 = createFileRoute("/_app/tasks")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var AppRoute = Route$24.update({
	id: "/_app",
	getParentRoute: () => Route$25
});
var LoginRoute = Route$23.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$25
});
var AppIndexRoute = Route$22.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppAiRoute = Route$21.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => AppRoute
});
var AppAnalyticsRoute = Route$20.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AppRoute
});
var AppAuditRoute = Route$19.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AppRoute
});
var AppCeoRoute = Route$18.update({
	id: "/ceo",
	path: "/ceo",
	getParentRoute: () => AppRoute
});
var AppCommerceRoute = Route$17.update({
	id: "/commerce",
	path: "/commerce",
	getParentRoute: () => AppRoute
});
var AppCustomersRoute = Route$16.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AppRoute
});
var AppDispatchRoute = Route$15.update({
	id: "/dispatch",
	path: "/dispatch",
	getParentRoute: () => AppRoute
});
var AppFinanceRoute = Route$14.update({
	id: "/finance",
	path: "/finance",
	getParentRoute: () => AppRoute
});
var AppKycRoute = Route$13.update({
	id: "/kyc",
	path: "/kyc",
	getParentRoute: () => AppRoute
});
var AppMapRoute = Route$12.update({
	id: "/map",
	path: "/map",
	getParentRoute: () => AppRoute
});
var AppNotificationsRoute = Route$11.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AppRoute
});
var AppOrdersRoute = Route$10.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AppRoute
});
var AppPeopleRoute = Route$9.update({
	id: "/people",
	path: "/people",
	getParentRoute: () => AppRoute
});
var AppRestaurantsRoute = Route$8.update({
	id: "/restaurants",
	path: "/restaurants",
	getParentRoute: () => AppRoute
});
var AppRidersRoute = Route$7.update({
	id: "/riders",
	path: "/riders",
	getParentRoute: () => AppRoute
});
var AppRiskRoute = Route$6.update({
	id: "/risk",
	path: "/risk",
	getParentRoute: () => AppRoute
});
var AppSearchRoute = Route$5.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => AppRoute
});
var AppSecurityRoute = Route$4.update({
	id: "/security",
	path: "/security",
	getParentRoute: () => AppRoute
});
var AppSupportRoute = Route$3.update({
	id: "/support",
	path: "/support",
	getParentRoute: () => AppRoute
});
var AppSystemRoute = Route$2.update({
	id: "/system",
	path: "/system",
	getParentRoute: () => AppRoute
});
var AppTasksRoute = Route$1.update({
	id: "/tasks",
	path: "/tasks",
	getParentRoute: () => AppRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$25
});
var AppRouteChildren = {
	AppAiRoute,
	AppAnalyticsRoute,
	AppAuditRoute,
	AppCeoRoute,
	AppCommerceRoute,
	AppCustomersRoute,
	AppDispatchRoute,
	AppFinanceRoute,
	AppKycRoute,
	AppMapRoute,
	AppNotificationsRoute,
	AppOrdersRoute,
	AppPeopleRoute,
	AppRestaurantsRoute,
	AppRidersRoute,
	AppRiskRoute,
	AppSearchRoute,
	AppSecurityRoute,
	AppSupportRoute,
	AppSystemRoute,
	AppTasksRoute,
	AppIndexRoute
};
var rootRouteChildren = {
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	LoginRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$25._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { getRouter, router_DOOV_cCI_exports as t };
