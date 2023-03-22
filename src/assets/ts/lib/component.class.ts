export default abstract class Component {
	contentEntryPoint: HTMLElement;
	appended = false;

	constructor(
		public entryPoint: HTMLElement
	) {
		this.contentEntryPoint = document.createElement("div");
		this.contentEntryPoint.classList.add("component");
	}

	replaceHtml(html: string) {
		this.contentEntryPoint.innerHTML = html;
		if (!this.appended) {
			this.entryPoint.appendChild(this.contentEntryPoint);
			this.appended = true;
		}
	}

	render(..._params: any) { } //TODO ---> look up how to fix this

	unrender() { //TODO ---> remove event listeners?
		this.entryPoint.removeChild(this.contentEntryPoint);
		this.appended = false;
	}
}