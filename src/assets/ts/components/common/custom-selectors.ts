import observeChildren from "../../lib/observeChildren";

export default () => {
	const customSelectorElmts = document.querySelectorAll<HTMLSelectElement>("[data-custom-selector]");
	for (const customSelectorElmt of customSelectorElmts) new CustomSelector(customSelectorElmt);
}

type CustomSelectorOption = {
	elmt: HTMLElement,
	originalElmt: HTMLOptionElement,
	value: string | null
}

/** 
 * A custom selectbox that styles better than the standard one.
 * 
 * Underneath, it still uses a standard selectbox, so formdata still works, as well as any standard selectbox events. Theres
 * also a MutationObserver that tracks the children of the selectbox too.
 * 
 * It *should* behave exactly the same as a standard selectbox!
 * */
class CustomSelector {
	opened = false;
	options: CustomSelectorOption[];
	selectedOption: CustomSelectorOption | null = null;

	elmt: HTMLElement;
	selectedOptionElmt: HTMLElement;
	optionListElmt: HTMLElement;

	private transitionDuration: number = 0;
	private firingSelectBoxEvent = false;

	constructor(
		public originalSelect: HTMLSelectElement
	) {
		this.elmt = this.generate.elmt();

		//put attributes currently on the selectbox onto the containing elmt
		this.elmt.id = originalSelect.id;
		this.elmt.className = originalSelect.className;
		originalSelect.removeAttribute("id");
		originalSelect.removeAttribute("class");
		originalSelect.removeAttribute("data-custom-selector");

		//and then replace the selectbox with this containing elmt
		this.originalSelect.replaceWith(this.elmt);
		this.elmt.appendChild(this.originalSelect);

		//generate the custom elements
		this.optionListElmt = this.generate.optionList();
		this.selectedOptionElmt = this.generate.selectedBox();

		//generate the custom option elements using the original options
		this.options = [];
		const originalOptions = Array.from(this.originalSelect.options);
		for (const option of originalOptions.map(originalOption => this.generate.option(originalOption))) this.addOption(option);

		//if it exists, select the originally selected option
		const originalSelectedOption = this.options.find(option => originalOptions.find(originalOption => originalOption.value === option.value && originalOption.selected));
		if (originalSelectedOption !== undefined) this.selectOption(originalSelectedOption);

		//custom elements are ready: add them to the dom now
		this.elmt.appendChild(this.selectedOptionElmt);
		this.elmt.appendChild(this.optionListElmt);

		//get the calculated transition duration for the options menu after adding to the DOM
		this.transitionDuration = parseFloat(getComputedStyle(this.optionListElmt).transitionDuration) * 1000;

		//close when clicking off
		window.addEventListener("click", ev => {
			if (ev.target === this.selectedOptionElmt || !this.opened || ev.target === this.elmt || this.elmt.contains(ev.target as HTMLElement)) return;
			this.close();
		});

		//observe if any options within the original selectbox are added/removed
		observeChildren(this.originalSelect, (action, child) => {
			const observedOption = child as HTMLOptionElement;

			if (action === "added") {
				const newOption = this.generate.option(observedOption);
				this.addOption(newOption);

			} else if (action === "removed") {
				const existingOption = this.options.find(option => option.originalElmt === observedOption);
				if (existingOption === undefined) throw new Error("Failed to find a corresponding custom option!");
				this.removeOption(existingOption);
			}
		});

		//listen to any changes to the original select box
		this.originalSelect.addEventListener("change", () => {
			if (this.firingSelectBoxEvent) { // ...but make sure to ignore events that we fired ourselves
				this.firingSelectBoxEvent = false;
				return;
			}

			//TODO ---> setTimeout is not ideal, but it fixes a problem where event listeners are fired before a mutation event occurs
			setTimeout(() => {
				const originalSelectedOption = this.originalSelect.selectedOptions[0];
				if (originalSelectedOption === undefined) return;

				const option = this.options.find(option => option.value === originalSelectedOption.value);
				if (option === undefined) throw new Error("Failed to find a corresponding custom option!");

				this.selectOption(option);
			}, 0);
		});
	}

	open() {
		this.opened = true;
		this.elmt.classList.add("opened");
	}

	close() {
		this.opened = false;
		this.elmt.classList.remove("opened");
	}

	toggle() {
		if (this.opened) {
			this.close();
		} else {
			this.open();
		}
	}

	addOption(option: CustomSelectorOption) {
		this.options.push(option);
		this.optionListElmt.appendChild(option.elmt);
	}

	removeOption(option: CustomSelectorOption) {
		this.options.splice(this.options.indexOf(option), 1);
		this.optionListElmt.removeChild(option.elmt);
	}

	selectOption(option: CustomSelectorOption) {
		//add new option text to the selected option box
		this.selectedOptionElmt.textContent = option.elmt.textContent;

		//update original select box
		this.originalSelect.selectedIndex = -1;
		option.originalElmt.selected = true;

		//update the selected option
		const previouslySelectedOption = this.selectedOption;
		this.selectedOption = option;

		//dispatch change event
		this.firingSelectBoxEvent = true;
		this.originalSelect.dispatchEvent(new Event("change"));

		this.close();

		setTimeout(() => {
			//show previous option to the list, and hide the new one
			if (this.selectedOption === null) return;

			this.selectedOption.elmt.classList.add("selected");
			if (previouslySelectedOption !== null) previouslySelectedOption.elmt.classList.remove("selected");

		}, this.transitionDuration);
	}

	private generate = {
		elmt: (): HTMLElement => {
			const elmt = document.createElement("div");
			return elmt;
		},
		selectedBox: (): HTMLElement => {
			const selectedBox = document.createElement("span");
			selectedBox.classList.add("selected-option");
			selectedBox.textContent = "Please select...";
			selectedBox.addEventListener("click", () => this.toggle());
			return selectedBox;
		},
		optionList: (): HTMLElement => {
			const optionList = document.createElement("ul");
			optionList.classList.add("options");
			return optionList;
		},
		option: (originalElmt: HTMLOptionElement): CustomSelectorOption => {
			const elmt = document.createElement("li");
			elmt.textContent = originalElmt.textContent;
			elmt.classList.add("option");
			const option: CustomSelectorOption = { elmt, originalElmt, value: originalElmt.value };
			option.elmt.addEventListener("click", () => this.selectOption(option));
			return option;
		}
	}

}