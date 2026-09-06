import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { r as useCurrentUserState, t as AuthSplash } from "./auth-splash-B0axxBos.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
import { t as GROK_PROVIDERS } from "./server-B8BlpmjO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-0S4qGQy0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSplash, {});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onEmail(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			if (mode === "up") {
				const { error: err } = await authClient.signUp.email({
					email,
					password,
					name
				});
				if (err) throw new Error(err.message ?? "Could not create account");
			} else {
				const { error: err } = await authClient.signIn.email({
					email,
					password
				});
				if (err) throw new Error(err.message ?? "Could not sign in");
			}
			window.location.href = "/";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign-in failed");
			setBusy(false);
		}
	}
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
					children: "Master admin and CEO command center for orders, restaurants, riders, money, and risk. Employees only see what their role requires."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "Guwahati · Commercial operations · Simulated marketplace until Shared Core"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex items-center justify-center p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl lg:hidden",
							children: "Roshoi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Sign in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Use your work account. First sign-in becomes CEO of this organisation."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							className: "w-full",
							onClick: () => signIn(p.providerId, { callbackURL: "/" }),
							children: ["Continue with ", p.label]
						}, p.providerId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
							"email",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-3",
						onSubmit: onEmail,
						children: [
							mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs text-muted",
								children: ["Full name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1",
									value: name,
									onChange: (e) => setName(e.target.value),
									required: true
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs text-muted",
								children: ["Work email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1",
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true,
									autoComplete: "username"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs text-muted",
								children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1",
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									required: true,
									autoComplete: mode === "up" ? "new-password" : "current-password"
								})]
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-danger",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: busy,
								children: busy ? "Please wait…" : mode === "up" ? "Create employee account" : "Sign in with email"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-muted underline",
						onClick: () => setMode(mode === "up" ? "in" : "up"),
						children: mode === "up" ? "Have an account? Sign in" : "Invited? Create an account"
					})
				]
			})
		})]
	});
}
//#endregion
export { Login as component };
