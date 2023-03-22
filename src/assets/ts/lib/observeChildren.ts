export default (target: Node, callback: (action: "added" | "removed", child: Node) => void) => new MutationObserver(mutations => {
	for (const mutation of mutations) {
		for (const addedNode of mutation.addedNodes) callback("added", addedNode);
		for (const removedNode of mutation.removedNodes) callback("removed", removedNode);
	}
}).observe(target, { subtree: false, childList: true });