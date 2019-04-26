import {JetView} from "webix-jet";
import FormView from "./addbook/form";

export default class FormController extends JetView {
	config() {
		return {
			type: "space",
			cols: [
				FormView
			]
		};
	}
}
