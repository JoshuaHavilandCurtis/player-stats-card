export default abstract class Component {
	contentEntryPoint: HTMLElement;

	constructor(
		public entryPoint: HTMLElement
	) {
		this.contentEntryPoint = document.createElement("div");
		this.contentEntryPoint.classList.add("component");
		this.entryPoint.appendChild(this.contentEntryPoint);
	}

	replaceHtml(html: string) {
		this.contentEntryPoint.innerHTML = html;
	}

	render(..._params: any) { } //TODO ---> look up how to fix this

	unrender() { //TODO ---> remove event listeners?
		this.contentEntryPoint.innerHTML = "";
	}
}