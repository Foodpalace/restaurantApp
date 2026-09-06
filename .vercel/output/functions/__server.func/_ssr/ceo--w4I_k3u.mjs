import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { H as runMarketplaceTick, V as runE2eSimulation, n as askAssistant, r as generateCeoReport, s as getCeoDashboard } from "./session-DoMkRxRe.mjs";
import { t as Button } from "./button-efe6RXBR.mjs";
import { n as formatBps, r as formatINR } from "./money-DdTRi1IE.mjs";
import { n as PageHeader, r as RequirePerm, t as ErrorBanner } from "./page-B8DAsT8Q.mjs";
import { n as CardTitle, t as Card } from "./card-C7aY7pux.mjs";
import { t as Kpi } from "./kpi-BVqsoTTZ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as computeEconomics, r as simulateCommissionChange, t as DEFAULT_PILOT_ASSUMPTIONS } from "./unit-economics-iH6bNIpH.mjs";
import { t as Input } from "./input-CWXujp7X.mjs";
import { t as Tabs } from "./tabs-BlcPaBF0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ceo--w4I_k3u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CeoPage() {
	const [tab, setTab] = (0, import_react.useState)("today");
	const [range, setRange] = (0, import_react.useState)("today");
	const q = useQuery({
		queryKey: ["ceo", range],
		queryFn: async () => {
			const r = await getCeoDashboard({ data: { range } });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		}
	});
	const qc = useQueryClient();
	const tick = useMutation({
		mutationFn: async () => {
			const r = await runMarketplaceTick();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		},
		onSuccess: (d) => {
			toast.success(`Simulated order ${d.orderId} delivered`);
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	const e2e = useMutation({
		mutationFn: async () => {
			const r = await runE2eSimulation();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		},
		onSuccess: () => {
			toast.success("End-to-end admin simulation recorded in the audit log");
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Command Center",
			description: "Business health first. Simulation does not change a live marketplace.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => tick.mutate(),
				disabled: tick.isPending,
				children: "Simulate one delivery"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => e2e.mutate(),
				disabled: e2e.isPending,
				children: "Run admin walkthrough"
			})] })
		}),
		q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
			message: q.error.message,
			onRetry: () => void q.refetch()
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				tabs: [
					{
						id: "today",
						label: "Today"
					},
					{
						id: "money",
						label: "Money"
					},
					{
						id: "economics",
						label: "Unit economics"
					},
					{
						id: "sim",
						label: "What-if"
					},
					{
						id: "ai",
						label: "CEO AI"
					},
					{
						id: "report",
						label: "Report"
					}
				],
				value: tab,
				onChange: setTab
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-10 rounded-sm border border-border bg-elevated px-2 text-sm",
				value: range,
				onChange: (e) => setRange(e.target.value),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "today",
						children: "Today"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "yesterday",
						children: "Yesterday"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "7d",
						children: "7 days"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "30d",
						children: "30 days"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "month",
						children: "Month"
					})
				]
			})]
		}),
		tab === "today" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayPane, { data: q.data }) : null,
		tab === "money" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyPane, { data: q.data }) : null,
		tab === "economics" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EconomicsPane, { data: q.data }) : null,
		tab === "sim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Simulator, {}) : null,
		tab === "ai" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeoAi, {}) : null,
		tab === "report" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportPane, {}) : null
	] });
}
function TodayPane({ data }) {
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [data.period, " · SIMULATED DATA"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Orders",
						value: String(data.money.orders),
						hint: `Yesterday ${data.prior.orders}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "GMV",
						value: formatINR(data.money.gmvPaise)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Contribution",
						value: formatINR(data.money.contributionPaise)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "AOV",
						value: formatINR(data.money.aovPaise)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Active restaurants",
						value: String(data.counts.restaurants)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Riders",
						value: String(data.counts.riders),
						hint: `${data.counts.online} online`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Active customers",
						value: String(data.counts.customers)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Delivery success",
						value: formatBps(data.money.deliverySuccessBps)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "mb-3 text-base",
					children: "Growing restaurants"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm",
					children: data.top.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-muted",
							children: [
								formatINR(r.gmv),
								" · ",
								r.orders,
								" orders"
							]
						})]
					}, r.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "mb-3 text-base",
					children: "Needs attention"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm",
					children: data.weak.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums text-muted",
							children: formatINR(r.gmv)
						})]
					}, r.id))
				})] })]
			})
		]
	});
}
function MoneyPane({ data }) {
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Loading…"
	});
	const m = data.money;
	const rows = [
		["Restaurant commission", m.restaurantCommissionPaise],
		["Delivery revenue", m.deliveryRevenuePaise],
		["Customer fees", m.customerFeesPaise],
		["Payment cost", -m.paymentCostPaise],
		["Rider cost", -m.riderCostPaise],
		["Refunds", -m.refundsPaise],
		["Platform promotions", -m.promotionalCostPaise],
		["Support (variable)", -m.supportCostPaise],
		["Infrastructure (variable)", -m.infraCostPaise]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "mb-1",
			children: "Platform contribution"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-xs text-muted",
			children: "SIMULATED DATA. 10% commission is not assumed profitable — this is the actual stack."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "space-y-2 text-sm",
			children: [rows.map(([label, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex justify-between border-b border-border py-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: formatINR(v)
				})]
			}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex justify-between pt-2 font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Contribution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: formatINR(m.contributionPaise)
				})]
			})]
		})
	] });
}
function EconomicsPane({ data }) {
	if (!data) return null;
	const slice = computeEconomics({
		...DEFAULT_PILOT_ASSUMPTIONS,
		orders: Math.max(1, data.money.orders),
		aovPaise: data.money.aovPaise || DEFAULT_PILOT_ASSUMPTIONS.aovPaise
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				label: "Revenue / order",
				value: formatINR(data.unit.revenuePerOrder)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				label: "Contribution / order",
				value: formatINR(data.unit.contributionPerOrder)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				label: "Break-even orders / day",
				value: data.unit.breakEvenOrdersPerDay == null ? "Not reached" : String(data.unit.breakEvenOrdersPerDay)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				label: "Commission / order",
				value: formatINR(Math.trunc(slice.restaurantCommissionPaise / Math.max(1, slice.gmvPaise ? data.money.orders || 1 : 1)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				label: "Rider cost / order",
				value: formatINR(DEFAULT_PILOT_ASSUMPTIONS.riderPayoutPaise)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				label: "Payment cost / order",
				value: formatINR(Math.trunc(slice.paymentCostPaise / Math.max(1, data.money.orders || 1)))
			})
		]
	});
}
function Simulator() {
	const [commissionBps, setCommissionBps] = (0, import_react.useState)(1e3);
	const [orders, setOrders] = (0, import_react.useState)(48);
	const [aov, setAov] = (0, import_react.useState)(420);
	const [discount, setDiscount] = (0, import_react.useState)(12);
	const [delivery, setDelivery] = (0, import_react.useState)(35);
	const [customerFee, setCustomerFee] = (0, import_react.useState)(5);
	const [rider, setRider] = (0, import_react.useState)(42);
	const [refundBps, setRefundBps] = (0, import_react.useState)(180);
	const [paymentBps, setPaymentBps] = (0, import_react.useState)(180);
	const [support, setSupport] = (0, import_react.useState)(2.5);
	const [marketing, setMarketing] = (0, import_react.useState)(250);
	const input = (0, import_react.useMemo)(() => ({
		...DEFAULT_PILOT_ASSUMPTIONS,
		commissionBps,
		orders,
		aovPaise: aov * 100,
		platformDiscountPaise: discount * 100,
		deliveryFeePaise: delivery * 100,
		customerFeePaise: customerFee * 100,
		riderPayoutPaise: rider * 100,
		refundRateBps: refundBps,
		paymentCostBps: paymentBps,
		supportCostPaise: Math.round(support * 100),
		marketingSpendPaise: marketing * 100
	}), [
		commissionBps,
		orders,
		aov,
		discount,
		delivery,
		customerFee,
		rider,
		refundBps,
		paymentBps,
		support,
		marketing
	]);
	const result = computeEconomics(input);
	const scenarios = [
		500,
		800,
		1e3,
		1200
	].map((bps) => ({
		bps,
		r: simulateCommissionChange(input, bps)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md border border-warn/40 bg-warn/10 px-3 py-2 text-xs",
				children: "SIMULATION — DOES NOT CHANGE LIVE SYSTEM."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Commission (bps)",
						value: commissionBps,
						onChange: setCommissionBps
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Orders / day",
						value: orders,
						onChange: setOrders
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "AOV (₹)",
						value: aov,
						onChange: setAov
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Platform discount / order (₹)",
						value: discount,
						onChange: setDiscount
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Delivery fee (₹)",
						value: delivery,
						onChange: setDelivery
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Customer fee (₹)",
						value: customerFee,
						onChange: setCustomerFee
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Rider payout (₹)",
						value: rider,
						onChange: setRider
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Refund rate (bps)",
						value: refundBps,
						onChange: setRefundBps
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Payment cost (bps)",
						value: paymentBps,
						onChange: setPaymentBps
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Support / order (₹)",
						value: support,
						onChange: setSupport
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Marketing / day (₹)",
						value: marketing,
						onChange: setMarketing
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Revenue",
						value: formatINR(result.revenuePaise)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Variable cost",
						value: formatINR(result.variableCostPaise)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Contribution",
						value: formatINR(result.contributionPaise)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Est. monthly (×30)",
						value: formatINR(result.contributionPaise * 30)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				label: "Break-even orders / day",
				value: result.breakEvenOrdersPerDay == null ? "Not reached at this unit contribution" : String(result.breakEvenOrdersPerDay)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "mb-3 text-base",
				children: "If commission changes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: scenarios.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [(s.bps / 100).toFixed(2), "%"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums",
						children: [formatINR(s.r.contributionPaise), " contribution"]
					})]
				}, s.bps))
			})] })
		]
	});
}
function Num({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-xs text-muted",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "number",
			className: "mt-1",
			value,
			onChange: (e) => onChange(Number(e.target.value) || 0)
		})]
	});
}
function CeoAi() {
	const [prompt, setPrompt] = (0, import_react.useState)("How did we perform today?");
	const mut = useMutation({
		mutationFn: async () => {
			const r = await askAssistant({ data: {
				prompt,
				mode: "ceo"
			} });
			if (!r.ok) throw new Error(r.error);
			return r.data;
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "mb-2",
			children: "CEO AI"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-xs text-muted",
			children: "Suggestions are not actions. Money movement still needs a human with permission."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			className: "mb-3 min-h-24 w-full rounded-sm border border-border bg-elevated p-3 text-sm",
			value: prompt,
			onChange: (e) => setPrompt(e.target.value)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => mut.mutate(),
			disabled: mut.isPending,
			children: mut.isPending ? "Thinking…" : "Ask"
		}),
		mut.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", {
			className: "mt-4 whitespace-pre-wrap rounded-md border border-border bg-elevated p-3 text-sm leading-relaxed",
			children: [mut.data.text, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 text-xs text-subtle",
				children: ["Provider: ", mut.data.provider]
			})]
		}) : null
	] });
}
function ReportPane() {
	const mut = useMutation({
		mutationFn: async () => {
			const r = await generateCeoReport();
			if (!r.ok) throw new Error(r.error);
			return r.data;
		},
		onError: (e) => toast.error(e.message)
	});
	const d = mut.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex items-center justify-between gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Daily CEO report"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => mut.mutate(),
			disabled: mut.isPending,
			children: "Generate"
		})]
	}), d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-warn",
				children: ["SIMULATED DATA · ", d.period]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Orders ",
				d.orders,
				" · GMV ",
				formatINR(d.gmvPaise),
				" · Contribution ",
				formatINR(d.contributionPaise)
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Top restaurants: ", d.topRestaurants.map((r) => r.name).join(", ") || "—"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Risks: ", d.alerts.join("; ") || "none open"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "list-disc pl-5",
				children: d.recommended.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "One click. Numbers come from authorized tables, not invention."
	})] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirePerm, {
	perm: "view_executive",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeoPage, {})
});
//#endregion
export { SplitComponent as component };
