import { t as FEATURE_FLAG_KEYS } from "./types-Bs7TloTr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/defaults-zsQ0FAhZ.js
var ORG_ID = "org_roshoi";
var DEFAULT_BRANDING = {
	appName: "Roshoi",
	tagline: "Command the marketplace",
	colorBg: "#0b0c0e",
	colorFg: "#ecece8",
	colorAccent: "#c5cdd8",
	colorSurface: "#141518",
	domain: "roshoi.app",
	appStoreName: "Roshoi",
	notificationSender: "Roshoi",
	invoiceLegalName: "Roshoi Commerce",
	restaurantFacingName: "Roshoi Partner",
	riderFacingName: "Roshoi Rider",
	customerFacingName: "Roshoi",
	locale: "en"
};
var DEFAULT_FLAGS = {
	customer_ai: {
		enabled: true,
		description: "Customer-facing AI assistance"
	},
	restaurant_ai: {
		enabled: true,
		description: "Restaurant-facing AI assistance"
	},
	rider_ai: {
		enabled: false,
		description: "Rider-facing AI assistance"
	},
	admin_ai: {
		enabled: true,
		description: "Employee AI assistance"
	},
	ceo_ai: {
		enabled: true,
		description: "CEO executive intelligence"
	},
	live_tracking: {
		enabled: true,
		description: "Live delivery tracking"
	},
	cod: {
		enabled: true,
		description: "Cash on delivery"
	},
	delivery_otp: {
		enabled: true,
		description: "Delivery OTP confirmation"
	},
	pod_photo: {
		enabled: true,
		description: "Proof of delivery photo"
	},
	qr_pickup: {
		enabled: false,
		description: "QR pickup at restaurant"
	},
	multi_order: {
		enabled: false,
		description: "Multi-order stacking"
	},
	loyalty: {
		enabled: true,
		description: "Loyalty programme"
	},
	referrals: {
		enabled: true,
		description: "Referral programme"
	},
	promotions: {
		enabled: true,
		description: "Promotions engine"
	},
	wallet: {
		enabled: false,
		description: "Customer wallet"
	},
	subscription: {
		enabled: false,
		description: "Subscription plans"
	},
	quick_commerce: {
		enabled: false,
		description: "Quick commerce"
	},
	b2b: {
		enabled: false,
		description: "B2B ordering"
	},
	advanced_dispatch: {
		enabled: false,
		description: "Advanced dispatch engine"
	},
	whatsapp: {
		enabled: false,
		description: "WhatsApp notifications"
	},
	sms: {
		enabled: false,
		description: "SMS notifications"
	},
	push: {
		enabled: true,
		description: "Push notifications"
	},
	offline_mode: {
		enabled: false,
		description: "Offline operations mode"
	}
};
var FEATURE_FLAG_LIST = FEATURE_FLAG_KEYS.map((key) => ({
	key,
	enabled: DEFAULT_FLAGS[key].enabled,
	description: DEFAULT_FLAGS[key].description
}));
var DEFAULT_SETTINGS = {
	business: {
		defaultCommissionBps: 1e3,
		defaultDeliveryFeePaise: 3500,
		defaultCustomerFeePaise: 500,
		currency: "INR",
		city: "Guwahati"
	},
	delivery: {
		radiusMeters: 6e3,
		offerTimeoutSeconds: 45,
		otpRequired: true
	},
	payments: {
		provider: "NOT_CONFIGURED",
		codEnabled: true
	},
	restaurants: { maxPrepMinutesWarn: 40 },
	riders: { payoutPerDeliveryPaise: 4200 },
	customers: { supportHours: "08:00–23:00 IST" },
	promotions: { maxPlatformDiscountBps: 2500 },
	loyalty: { pointsPerRupee: 1 },
	notifications: { provider: "NOT_CONFIGURED" },
	ai: {
		provider: "xai",
		model: "grok-4.5"
	},
	security: { sessionHours: 12 },
	support: { defaultSlaMinutes: 30 }
};
var ZONES = [
	{
		code: "PANBAZAR",
		name: "Panbazar",
		lat: 26.183,
		lng: 91.745
	},
	{
		code: "UZAN",
		name: "Uzan Bazar",
		lat: 26.187,
		lng: 91.752
	},
	{
		code: "FANCY",
		name: "Fancy Bazar",
		lat: 26.181,
		lng: 91.74
	},
	{
		code: "GANESH",
		name: "Ganeshguri",
		lat: 26.143,
		lng: 91.792
	},
	{
		code: "ZOO",
		name: "Zoo Road",
		lat: 26.166,
		lng: 91.78
	},
	{
		code: "BELTOLA",
		name: "Beltola",
		lat: 26.12,
		lng: 91.8
	},
	{
		code: "SIXMILE",
		name: "Six Mile",
		lat: 26.135,
		lng: 91.82
	},
	{
		code: "KAHILI",
		name: "Kahilipara",
		lat: 26.144,
		lng: 91.77
	}
];
//#endregion
export { ORG_ID as a, FEATURE_FLAG_LIST as i, DEFAULT_FLAGS as n, ZONES as o, DEFAULT_SETTINGS as r, DEFAULT_BRANDING as t };
