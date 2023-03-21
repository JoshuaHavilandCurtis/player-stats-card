import selector from "./components/selector";
import domLoaded from "./lib/dom-loaded";

domLoaded().then(() => {
	selector();
});