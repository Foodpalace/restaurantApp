//#region node_modules/.nitro/vite/services/ssr/assets/ids-Dmt_GKG2.js
function newId(prefix) {
	const rand = Math.random().toString(36).slice(2, 10);
	return `${prefix}_${Date.now().toString(36)}${rand}`;
}
function requestId() {
	return newId("req");
}
//#endregion
export { requestId as n, newId as t };
