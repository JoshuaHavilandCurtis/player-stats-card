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

	render(..._params: any) { } //TODO ---> look up how to fix this

	unrender() { //TODO ---> remove event listeners?
		this.entryNode.removeChild(this.node);
		this.appended = false;
	}
}