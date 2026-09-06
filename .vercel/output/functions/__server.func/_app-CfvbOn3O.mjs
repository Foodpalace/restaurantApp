import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link, y as Navigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal, i as DialogOverlay, r as DialogContent, t as Dialog } from "./_libs/@radix-ui/react-dialog+[...].mjs";
import { i as signOut } from "./_ssr/client-B40BzJxt.mjs";
import { n as useCurrentUser, r as useCurrentUserState, t as AuthSplash } from "./_ssr/auth-splash-B0axxBos.mjs";
import { G as t, J as useT, K as useCan, o as getBootstrap, q as useSessionBoot, t as SessionProvider } from "./_ssr/session-DoMkRxRe.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { t as Button } from "./_ssr/button-efe6RXBR.mjs";
import { _ as Bike, a as Store, c as Settings, d as Map, f as LifeBuoy, g as ClipboardList, h as Compass, l as Search, m as Flag, n as Wallet, o as Sparkles, p as LayoutDashboard, r as Users, s as Shield, u as Menu, v as Bell, y as Activity } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-CfvbOn3O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var Sheet = Dialog;
function SheetContent({ className, children, side = "left" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
		className: cn("fixed z-50 flex h-full w-[min(20rem,88vw)] flex-col border-border bg-surface p-4 shadow-panel", side === "left" ? "inset-y-0 left-0 border-r" : "inset-y-0 right-0 border-l", className),
		children
	})] });
}
var ICONS = {
	"/": LayoutDashboard,
	"/ceo": Compass,
	"/ai": Sparkles,
	"/search": Search,
	"/orders": ClipboardList,
	"/dispatch": Flag,
	"/map": Map,
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
	"/notifications": Bell
};
function NavList({ onNavigate }) {
	const { boot, locale } = useSessionBoot();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-5",
		"aria-label": "Primary",
		children: boot.nav.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-subtle",
			children: t(locale, section.labelKey)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-0.5",
			children: section.items.map((item) => {
				const Icon = ICONS[item.to] ?? LayoutDashboard;
				const active = pathname === item.to || item.to !== "/" && pathname.startsWith(item.to);
				const label = t(locale, item.key);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.to,
					onClick: onNavigate,
					title: label,
					className: cn("flex min-h-10 items-center gap-2 rounded-md px-2 text-sm", active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/70 hover:text-fg"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate whitespace-nowrap",
						children: label
					})]
				}) }, item.to);
			})
		})] }, section.id))
	});
}
function AppShell({ children }) {
	const { boot, locale, setLocale } = useSessionBoot();
	const tr = useT();
	const can = useCan();
	const [open, setOpen] = (0, import_react.useState)(false);
	const brand = boot.branding;
	const mobileTabs = (0, import_react.useMemo)(() => {
		return [
			"/",
			"/ceo",
			"/orders",
			"/support",
			"/finance"
		].filter((p) => boot.nav.some((s) => s.items.some((i) => i.to === p))).slice(0, 4);
	}, [boot.nav]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		style: {
			["--color-bg"]: brand.colorBg,
			["--color-fg"]: brand.colorFg,
			["--color-accent"]: brand.colorAccent,
			["--color-surface"]: brand.colorSurface
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:p-2",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-dvh",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "hidden w-60 shrink-0 border-r border-border bg-surface/80 lg:flex lg:flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 pt-5 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl tracking-tight",
							children: brand.appName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: brand.tagline
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto px-3 pb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, {})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-bg/90 px-3 py-2 backdrop-blur-sm lg:px-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
									open,
									onOpenChange: setOpen,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "lg:hidden",
										onClick: () => setOpen(true),
										"aria-label": "Open menu",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-4 font-display text-lg",
										children: brand.appName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, { onNavigate: () => setOpen(false) })] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "min-w-0 flex-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-sm text-muted",
										children: [
											boot.session.name,
											" · ",
											boot.session.roleName,
											boot.session.teamName ? ` · ${boot.session.teamName}` : ""
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden rounded-full border border-warn/40 bg-warn/10 px-2 py-1 text-[10px] font-medium tracking-wide text-warn uppercase sm:inline",
									children: tr("sim.short")
								}),
								can("view_dashboard") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/search",
									className: "hidden min-h-10 items-center gap-1 rounded-sm border border-border px-3 text-sm text-muted md:flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }), " Search"]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									"aria-label": "Language",
									className: "h-10 rounded-sm border border-border bg-elevated px-2 text-xs",
									value: locale,
									onChange: (e) => setLocale(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "en",
											children: "EN"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "bn",
											children: "বাংলা"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "as",
											children: "অসমীয়া"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "hi",
											children: "हिन्दी"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-warn/30 bg-warn/10 px-3 py-2 text-xs text-fg lg:px-6",
							children: tr("sim.banner")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
							id: "main",
							className: "flex-1 px-3 py-5 pb-24 lg:px-8 lg:pb-8",
							children
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface lg:hidden",
				"aria-label": "Mobile",
				children: [mobileTabs.map((to) => {
					const Icon = ICONS[to] ?? LayoutDashboard;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						className: "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), to === "/" ? "Home" : to.slice(1)]
					}, to);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] text-muted",
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" }), "More"]
				})]
			})
		]
	});
}
function AppLayout() {
	const { user, isPending } = useCurrentUserState();
	const [boot, setBoot] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [locale, setLocale] = (0, import_react.useState)("en");
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let cancelled = false;
		getBootstrap().then((r) => {
			if (cancelled) return;
			if (!r.ok) setErr({
				code: r.code,
				error: r.error
			});
			else {
				setBoot(r.data);
				setLocale(r.data.branding.locale);
			}
		}).catch((e) => {
			if (cancelled) return;
			const message = e instanceof Error ? e.message : "Could not load your workspace.";
			setErr({
				code: message === "Unauthorized" ? "AUTH" : "ERROR",
				error: message === "Unauthorized" ? "Unauthorized" : "We couldn't load your workspace. Please retry."
			});
		});
		return () => {
			cancelled = true;
		};
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSplash, { message: "Checking your session." });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (err?.code === "AUTH") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (err?.code === "PENDING") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "Waiting for activation"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: err.error
			})]
		})
	});
	if (err?.code === "SUSPENDED") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "Account suspended"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: err.error
			})]
		})
	});
	if (err) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: err.error
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "mt-3 underline",
			onClick: () => window.location.reload(),
			children: "Retry"
		})] })
	});
	if (!boot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSplash, { message: "Preparing your workspace." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionProvider, {
		boot,
		locale,
		setLocale,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
//#endregion
export { AppLayout as component };
