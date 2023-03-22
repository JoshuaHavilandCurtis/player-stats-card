import Component from "../../lib/component.class";

/**
 * A loading wheel that appears over the player card container while we wait for
 * promises to resolve
 */

export class LoaderComponent extends Component {
	create() {
		this.replaceHtml(`<div class="loader-container"><div class="loader"></div></div>`);
	}
}