import { JetView } from "webix-jet/dist/index";
import "../librarian.css";

export default class MailView extends JetView {
	config() {
		const form = {
			view: "form",
			localId: "form",
			width: 600,
			scroll: false,
			borderless: true,
			elements: [
				{
					view: "text",
					name: "subject",
					label: "Subject:",
					labelWidth: 70
				},
				{
					view: "textarea",
					name: "text",
					label: "Text:",
					labelWidth: 70,
					height: 200
				},
			],
			rules: {
				$all: webix.rules.isNotEmpty
			}
		};

		const saveButton = {
			view: "button",
			localId: "sendButton",
			type: "form",
			value: "Send mail",
			width: 200,
			css: "sendButton",
			click: () => {
				const values = this.$getForm().getValues();
				this.onSubmit(values);
			}
		};

		return {
			view: "window",
			localId: "popup",
			width: 1000,
			position: "center",
			modal: true,
			head: {
				view: "toolbar",
				cols: [
					{
						template: " ",
						type: "header",
						localId: "formTemplate"
					},
					{
						view: "icon",
						icon: "wxi-close",
						click: () => {
							this.$$("popup").hide();
						}
					}
				]
			},
			body: {
				rows: [
					{
						cols: [
							{rows: [form]},
						]
					},
					saveButton
				]
			},
			on: {
				onHide: () => {
					this.$getForm().clear();
					this.$getForm().clearValidation();
				}
			}
		};
	}

	showWindow(values, filled) {
		this.getRoot().show();
		let form = this.$getForm();
		if (values) {
			if (values.length < 2)
				this.$$("formTemplate").define({template: "Send mail to "+ values.length +" user"});
			else
				this.$$("formTemplate").define({template: "Send mail to "+ values.length +" users"});

			this.$$("formTemplate").refresh();
			this.$getForm().setValues(values);
		}
		this.onSubmit = function (data) {
			if (form.validate()) {
				filled(data);
			}
		};
	}

	$getForm() {
		return this.$$("form");
	}

	hide() {
		this.$$("popup").hide();
	}
}
