export default () => {
	const customSelectContainers = document.querySelectorAll<HTMLElement>("[data-selector]");
	for (const customSelectContainer of customSelectContainers) {
		const select = customSelectContainer.querySelector<HTMLSelectElement>("select");
		if (select === null) throw new Error("Custom select box was specified, but missing normal select box!");
		new CustomSelect(customSelectContainer, select);
	}
}

interface CustomOptionList {
	elmt: HTMLElement,
	options: CustomOption[],
	selected: CustomOption | null,
	transitionDuration?: number
}

interface CustomOption {
	elmt: HTMLElement,
	originalElmt: HTMLOptionElement,
	value: string | null
}

class CustomSelect {
	visible = false;
	selectedBox: HTMLElement;
	optionList: CustomOptionList;

	constructor(
		private container: HTMLElement,
		private originalSelect: HTMLSelectElement
	) {
		this.optionList = this.createOptionList();

		//create the node where the text will be interchanged depending on the selected option
		this.selectedBox = document.createElement("span");
		this.selectedBox.classList.add("selected");
		this.selectedBox.addEventListener("click", () => this.toggle());
		this.selectOption(this.optionList.selected);

		//append to container
		this.container.appendChild(this.selectedBox);
		this.container.appendChild(this.optionList.elmt);

		//get the calculated transition duration for the options menu once its been appended to the DOM
		this.optionList.transitionDuration = parseFloat(getComputedStyle(this.optionList.elmt).transitionDuration) * 1000;

		//close when clicking off
		window.addEventListener("click", (ev: MouseEvent) => {
			if (ev.target === this.selectedBox || !this.visible || ev.target === this.container || this.container.contains(ev.target as HTMLElement)) return;
			this.close();
		});
	}

	open() {
		this.visible = true;
		this.container.classList.add("visible");
	}

	close() {
		this.visible = false;
		this.container.classList.remove("visible");
	}

	toggle() {
		if (this.visible) {
			this.close();
		} else {
			this.open();
		}
	}

	selectOption(option: CustomOption | null) {
		if (option === null) {
			this.selectedBox.textContent = "Please select...";
			return;
		}

		if (option.value === null) throw new Error("Custom select option has no value!");

		//add new option text to the selected option box
		this.selectedBox.textContent = option.elmt.textContent;

		//update original select box
		this.originalSelect.selectedIndex = -1;
		option.originalElmt.selected = true;

		//update the selected option
		const previouslySelectedOption = this.optionList.selected;
		this.optionList.selected = option;

		//dispatch change event
		const ev = new Event("change");
		this.originalSelect.dispatchEvent(ev);
		this.close();

		setTimeout(() => {
			//show previous option to the list, and hide the new one
			this.optionList.selected?.elmt.classList.add("hidden");
			if (!previouslySelectedOption?.originalElmt.disabled) previouslySelectedOption?.elmt.classList.remove("hidden");
		}, this.optionList.transitionDuration);
	}

	private createOptionList() {
		//create list elmt
		const elmt = document.createElement("ul");
		elmt.classList.add("options");

		//create options
		const originalOptions = Array.from(this.originalSelect.options);
		const options = originalOptions.map(originalOption => this.createOption(originalOption));
		for (const option of options) elmt.appendChild(option.elmt);

		//find the selected option
		const selectedOption = options.find(option => originalOptions.find(originalOption => originalOption.value === option.value && originalOption.selected));
		const optionList: CustomOptionList = { elmt, options: options, selected: selectedOption ?? null };
		return optionList;
	}

	private createOption(originalElmt: HTMLOptionElement) {
		const elmt = document.createElement("li");
		elmt.textContent = originalElmt.textContent;
		elmt.classList.add("option");
		const option: CustomOption = { elmt, originalElmt, value: originalElmt.value };

		//select the option when clicking on it
		option.elmt.addEventListener("click", () => this.selectOption(option));

		return option;
	}
}