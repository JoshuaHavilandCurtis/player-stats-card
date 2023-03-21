export default async () => new Promise<void>(resolve => {
	if (document.readyState === "interactive" || document.readyState === "complete") return resolve();
	document.addEventListener("DOMContentLoaded", function domLoadedCallback() {
		document.removeEventListener("DOMContentLoaded", domLoadedCallback);
		return resolve();
	});
});