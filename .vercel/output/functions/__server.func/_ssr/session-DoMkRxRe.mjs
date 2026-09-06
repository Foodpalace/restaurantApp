import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DXMOG4Vq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-DoMkRxRe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getBootstrap = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("81f367ba3a7918cb77b238d030a8672614dc60d2a376326a0719a03e28083bc7"));
var getOpsHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6de6c8bf73fdc69b47ae1f7600b5de63c4029bbdbb3072c7b3d19954f4140a21"));
var getCeoDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("181a2753771c63ca84032158adb2180d16276cf6d25c48285c8c8811d8c9d586"));
var getOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1200aec9177de4dbf044945d9d9558953ff957411d16d3d2a47b29a049a72f7c"));
var getOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4f1b740bf00dd9e34697e5306fecdf191a11111a0d9d646da3b634db1f4ad43c"));
var mutateOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("35fb8fca68ab77f61a54d0d80213eaa38c398c792f053260a37c28a1560d880d"));
var getRestaurants = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("2b2d6d254f944a64564db5836d2c3e7887da819ef7f93b99a04da7c8276ca6ba"));
var mutateRestaurant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("2bd0f27ca0eea2a908c48181f7254962e2b1729efd6ad8e6152318a601152db7"));
var getRiders = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f56c9b5920e7430a2d5c007c99b4f3bca974892f7b747c68b4d2b244ebf8066c"));
var mutateRider = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("67cfff7456d80e40ead2f55532d582ff65f28febdb4662b067c115dc6c556d28"));
var getCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("62c5dc756d30ccb844bba1a48fc3388458417270cf0d04c17686f5cc28f5b45a"));
var mutateCustomer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("07958c8ab29077151f3a94589bf5ac43d9ece8069ecacc0a1a9ec4846dc14347"));
var getDispatch = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("280c0a31fd7a5c1af1eee460808bd65e465369c46e2a49ab8fb9fd6768167b7e"));
var getMap = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("05157fb156bfc729efd97a1616de83c2b0b801d875eb7c0da3e400335354977f"));
var getSupport = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b69fc18c94161ab9738bc330b5e35225ed078040991ade5313e3efe472bbf573"));
var mutateTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c9d63de0037c412eebf50f3e2a66e34d6ee6f065d4aa0b8790c1b2b54f79a5a8"));
var getTasks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8920e55c87aa4356910780c865eac1eeafc7bb00d80e9727d295a2b7c83778ed"));
var mutateTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("54909325b5256e81c733c6e9047b56f784d72063121b2990c9027a913e0df094"));
var getFinance = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9cae4828029cdab321ac27f92f91761538a618713378a5a46eaf5930c40897be"));
var mutateSettlement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("340ed9e81b167bfbf07e6f2fb4d268e5748224f633ea1ba0d2876e9160ff80a0"));
var getCommerce = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fe5e02f2956fc61e0fc8e1953809a328cefe785677d9d396d432f5d22b015cc6"));
var mutatePromotion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b3f4628d9325da8fb0db892b840349a78eb9f9ef8f6c38e880181fdf25bf8023"));
var mutateCampaign = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8c1adc385f7ab3c7741c67d442d7d7ae3275f41fc76f4a99848894c0f92e414f"));
var getKyc = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("cad28d061ef2c3aef8caf45ac3d753efd1f4b03cb1385edc1d96a4648e140013"));
var mutateKyc = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("cfdb69c12f1673fb7e42d3d1315c7dccfc1d60631d3425c053f04eb9ff1bd553"));
var getRisk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d26703bddb2898c4ae124631386b5904ca494552d5027b1a2d3ed2b9d3ad4a66"));
var mutateRisk = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9a6d3a1e9cd8116aa7e059e12e40f24ef3ac375450ea36fc476c4c8aab80f0cd"));
var getPeople = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f94980eec7c1029c2b66526de653c8c523659754c0d0c2b573f77d3aff9d991a"));
var inviteEmployee = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("346fb29605e0c183a725ddfa3a22330b7c96076006f3325cc984d46114b72b53"));
var mutateEmployee = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("acbffeab56e5ae26f9860b19f99dda426fe20513e6206d21340d89b86e607d87"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f5a56ea810f74dffc966f360e0d9ec99e7a796112d718041f4f6674e056e98cd"));
var getAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("30ea7b8aba374bac3077d1b4cfe01bc2232920fea9931f5e8ebe472d837257aa"));
var getAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("35667fafe92a868863b2fed381a74e9e7b1f6335e6afb09dc8ba8fe76ce50901"));
var getNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e57e6d8dbb9feaec3503f2e50f177f8151119bccd85e153d58a647d7b758a517"));
var getHealth = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("46bb1e374a280bf3cc684bb2328e914d9fbc688fb917a1e14d8a462de713f43e"));
var getSystem = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3450c2da89c7d597dc40516af7a95856a2322858f0e4e53a7bda79b3036c7c96"));
var saveSystem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8e13bd6fdc623e44e8ff45ca3e55c8a0f35a0cfbf76700c8b7bffb93e053ccf5"));
var getSearch = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("fc659d05d79b5a1334c70d6222daa628a6ead0df45c55331abc7eaf9d0093910"));
var getSecurity = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ea2d40a33b1e7fdbb0a35763e9725b2bac2fce674bf186c2b7e990ca511dafce"));
var runNlQuery = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("039adb66e4ea5dc87eafd39474e7ac423d458970f74480c942afab0ccc49a26b"));
var askAssistant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1391d4d5f995b4e1c4dcedcb4876723403335c41cbfda408e29e70c32e018b6f"));
var generateCeoReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("c63588631559272bb5c73c78dcb6471d3e079df145ecbef4b594c7cae9d4213a"));
var runMarketplaceTick = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("d6a55f1bafc917d4da2514199851f66fb317960799a2325fe1c0026da56efe8a"));
var runE2eSimulation = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("9fa04f8e6748abc3759474c6b5ee0734775ec8d620a224e2acfb8e8a55b7190d"));
var EN = {
	"brand.tagline": "Command the marketplace",
	"nav.home": "Home",
	"nav.ceo": "Command Center",
	"nav.economics": "Unit economics",
	"nav.simulator": "What-if",
	"nav.ceoAi": "CEO AI",
	"nav.reports": "Reports",
	"nav.orders": "Orders",
	"nav.dispatch": "Dispatch",
	"nav.map": "Live map",
	"nav.support": "Support",
	"nav.tasks": "Tasks",
	"nav.restaurants": "Restaurants",
	"nav.riders": "Riders",
	"nav.kyc": "KYC",
	"nav.customers": "Customers",
	"nav.promotions": "Promotions",
	"nav.loyalty": "Loyalty",
	"nav.marketing": "Marketing",
	"nav.commerce": "Growth",
	"nav.finance": "Finance",
	"nav.settlements": "Settlements",
	"nav.risk": "Fraud & risk",
	"nav.security": "Security",
	"nav.audit": "Audit log",
	"nav.employees": "People",
	"nav.roles": "Roles",
	"nav.analytics": "Analytics",
	"nav.notifications": "Notifications",
	"nav.branding": "Branding",
	"nav.flags": "Feature flags",
	"nav.settings": "System",
	"nav.health": "Health",
	"nav.ai": "AI assist",
	"nav.search": "Search",
	"nav.section.command": "Command",
	"nav.section.ops": "Operations",
	"nav.section.network": "Network",
	"nav.section.growth": "Growth",
	"nav.section.money": "Money",
	"nav.section.trust": "Trust",
	"nav.section.org": "Organisation",
	"sim.banner": "SIMULATED DATA — marketplace records are demonstration data until Shared Core is connected. They are not live customer, restaurant, or rider activity.",
	"sim.short": "SIMULATED DATA",
	"sim.action": "Simulation — does not change a live marketplace.",
	"auth.pending": "Your account is waiting for an administrator to activate access.",
	"auth.suspended": "This employee account is suspended.",
	"auth.signIn": "Sign in to Roshoi",
	"auth.email": "Work email",
	"auth.password": "Password",
	"auth.name": "Full name",
	"auth.create": "Create employee account",
	"auth.have": "Have an account? Sign in",
	"auth.need": "Invited? Create an account",
	"action.retry": "Retry",
	"action.save": "Save",
	"action.cancel": "Cancel",
	"action.confirm": "Confirm",
	"action.export": "Export",
	"empty.none": "Nothing here yet.",
	"denied.title": "You do not have access",
	"denied.body": "This area is limited to employees with the required permission.",
	"home.happening": "What is happening",
	"home.wrong": "What is wrong",
	"home.action": "What needs action",
	"home.money": "What is making or losing money",
	"ceo.title": "Command Center",
	"ceo.subtitle": "Business health, money, and what to do next.",
	"queue.support": "Open tickets",
	"queue.onboarding": "Restaurant onboarding",
	"queue.kyc": "Pending KYC",
	"queue.finance": "Settlement exceptions",
	"queue.risk": "Fraud signals",
	"queue.dispatch": "Unassigned orders"
};
var DICTS = {
	en: EN,
	bn: {
		"brand.tagline": "মার্কেটপ্লেস পরিচালনা করুন",
		"nav.home": "হোম",
		"nav.ceo": "কমান্ড সেন্টার",
		"nav.orders": "অর্ডার",
		"nav.dispatch": "ডিসপ্যাচ",
		"nav.map": "লাইভ ম্যাপ",
		"nav.support": "সাপোর্ট",
		"nav.tasks": "টাস্ক",
		"nav.restaurants": "রেস্তোরাঁ",
		"nav.riders": "রাইডার",
		"nav.kyc": "কেওয়াইসি",
		"nav.customers": "গ্রাহক",
		"nav.finance": "ফিনান্স",
		"nav.employees": "কর্মচারী",
		"nav.analytics": "অ্যানালিটিক্স",
		"nav.settings": "সেটিংস",
		"nav.ai": "এআই সহায়তা",
		"nav.search": "খোঁজ",
		"sim.banner": "সিমুলেটেড ডেটা — Shared Core সংযুক্ত না হওয়া পর্যন্ত এটি প্রদর্শনী তথ্য।",
		"sim.short": "সিমুলেটেড ডেটা",
		"auth.pending": "প্রশাসক অ্যাক্সেস সক্রিয় করার অপেক্ষায়।",
		"auth.suspended": "এই কর্মচারী অ্যাকাউন্ট স্থগিত।",
		"auth.signIn": "রোশোই-তে সাইন ইন করুন",
		"action.retry": "আবার চেষ্টা",
		"empty.none": "এখনও কিছু নেই।",
		"denied.title": "আপনার অ্যাক্সেস নেই",
		"denied.body": "এই এলাকা নির্দিষ্ট অনুমতি সম্পন্ন কর্মচারীদের জন্য।"
	},
	as: {
		"brand.tagline": "মাৰ্কেটপ্লেচ পৰিচালনা কৰক",
		"nav.home": "হোম",
		"nav.ceo": "কমাণ্ড চেণ্টাৰ",
		"nav.orders": "অৰ্ডাৰ",
		"nav.dispatch": "ডিস্পেচ",
		"nav.map": "লাইভ মেপ",
		"nav.support": "সাপৰ্ট",
		"nav.restaurants": "ৰেষ্টুৰেণ্ট",
		"nav.riders": "ৰাইডাৰ",
		"nav.customers": "গ্ৰাহক",
		"nav.finance": "ফিনান্স",
		"nav.employees": "কৰ্মচাৰী",
		"nav.ai": "এআই সহায়",
		"nav.search": "সন্ধান",
		"sim.short": "ছিমুলেটেড ডেটা",
		"sim.banner": "ছিমুলেটেড ডেটা — Shared Core সংযোগ নোহোৱালৈকে এইটো প্ৰদৰ্শনী তথ্য।"
	},
	hi: {
		"brand.tagline": "मार्केटप्लेस चलाएँ",
		"nav.home": "होम",
		"nav.ceo": "कमांड सेंटर",
		"nav.orders": "ऑर्डर",
		"nav.dispatch": "डिस्पैच",
		"nav.map": "लाइव मैप",
		"nav.support": "सपोर्ट",
		"nav.restaurants": "रेस्तराँ",
		"nav.riders": "राइडर",
		"nav.customers": "ग्राहक",
		"nav.finance": "वित्त",
		"nav.employees": "कर्मचारी",
		"nav.ai": "एआई सहायता",
		"nav.search": "खोज",
		"sim.short": "सिम्युलेटेड डेटा",
		"sim.banner": "सिम्युलेटेड डेटा — Shared Core जुड़ने तक यह प्रदर्शन डेटा है।"
	}
};
function t(locale, key) {
	return DICTS[locale]?.[key] ?? EN[key];
}
var Ctx = (0, import_react.createContext)(null);
function SessionProvider({ boot, locale, setLocale, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			boot,
			locale,
			setLocale
		},
		children
	});
}
function useSessionBoot() {
	const v = (0, import_react.useContext)(Ctx);
	if (!v) throw new Error("Session missing");
	return v;
}
function useT() {
	const { locale } = useSessionBoot();
	return (key) => t(locale, key);
}
/** Stable permission checker. Call once at the top of a component — never inside conditions or loops. */
function useCan() {
	const { boot } = useSessionBoot();
	const perms = boot.session.permissions;
	return (key) => perms.includes(key);
}
//#endregion
export { mutateCustomer as A, mutateTicket as B, getSearch as C, getTasks as D, getSystem as E, mutateRestaurant as F, t as G, runMarketplaceTick as H, mutateRider as I, useT as J, useCan as K, mutateRisk as L, mutateKyc as M, mutateOrder as N, inviteEmployee as O, mutatePromotion as P, mutateSettlement as R, getRisk as S, getSupport as T, runNlQuery as U, runE2eSimulation as V, saveSystem as W, getOrder as _, getAudit as a, getRestaurants as b, getCommerce as c, getFinance as d, getHealth as f, getOpsHome as g, getNotifications as h, getAnalytics as i, mutateEmployee as j, mutateCampaign as k, getCustomers as l, getMap as m, askAssistant as n, getBootstrap as o, getKyc as p, useSessionBoot as q, generateCeoReport as r, getCeoDashboard as s, SessionProvider as t, getDispatch as u, getOrders as v, getSecurity as w, getRiders as x, getPeople as y, mutateTask as z };
