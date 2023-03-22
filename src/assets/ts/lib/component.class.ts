export default abstract class Component {
	node: HTMLElement;
	appended = false;

	constructor(
		public entryNode: HTMLElement
	) {
		this.node = document.createElement("div");
		this.node.classList.add("component");
	}

	replaceHtml(html: string) {
		this.node.innerHTML = html;
		if (!this.appended) {
			this.entryNode.appendChild(this.node);
			this.appended = true;
		}
	}

	create(_props: {}) { } //TODO ---> look up how to fix this

	destroy() { //TODO ---> remove event listeners?
		this.replaceHtml(""); //potentially unnecessary
		this.entryNode.removeChild(this.node);
		this.appended = false;
	}
}