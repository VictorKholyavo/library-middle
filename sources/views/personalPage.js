import {JetView} from "webix-jet";
import "./personalpage.css"

let counter = null;

export default class PersonalPageView extends JetView{
	config(){
		const header = {
			view:"toolbar",
			margin:-4,
			cols:[
				{
					view: "template",
					height: 40,
					template: "Personal information",
					borderless: true,
					css: "headerInfo"
				},
				{
					view:"icon",
					icon:"wxi-close",
					padding: 20,
					click: () => {
						this.show("/top");
					}
				}
			]
		};

		const form = {
			view: "form",
			localId: "form",
			scroll: false,
			elements: [
				{
					view: "text",
					name: "firstname",
					label: "Firstname",
					labelWidth: 100
				},
				{
					view: "text",
					name: "surname",
					label: "Surname",
					labelWidth: 100
				},
				{
					view: "text",
					name: "patronymic",
					label: "Patronymic",
					labelWidth: 100
				},
				{
					view: "text",
					name: "passport",
					label: "Passport",
					labelWidth: 100
				},
				{
					view: "text",
					name: "dateofbirth",
					label: "Date of Birth",
					labelWidth: 100
				},
				{
					view: "text",
					name: "address",
					label: "Address",
					labelWidth: 100
				},
				{},
			],
			rules: {
				$all: webix.rules.isNotEmpty
			}
		};
		const button = {
			cols: [
				{
					view: "button",
					localId: "updateButton",
					value: "Save",
					type: "form",
					css: "page-buttons",
					click: () => {
						const newValues = this.$getForm().getValues();
						this.savePersonalInformation(newValues);
					}
				},
				{
					view: "button",
					value: "Add one more phone",
					css: "page-buttons",
					click: () => {
						if (counter < 4) {
							counter++;
							this.$getForm().addView({
								view: "text",
								label: "Phone "+counter,
								labelWidth: 100,
								name: "phone"+counter
							});
						}
						else {
							webix.message({type: "error", text: "Max phones: 4"});
						}
					}
				}
			]
		};
		return {
			cols: [{}, {rows: [{}, header, form, button, {}]}, {}]
		};
	}
	$getForm() {
		return this.$$("form");
	}
	savePersonalInformation(newValues) {
		webix.ajax().put("http://localhost:3016/userinfo/" + newValues.id, newValues).then(function () {
			webix.message({type: "success", text: "Your information has been updated"});
		});
	}
	init() {
		let form = this.$getForm();
		webix.ajax().get("http://localhost:3016/userinfo").then(function (response) {
			response = response.json();
			response.phones.map(function (phone, index) {
				response["phone"+(index+1)] = phone.phone;
				form.addView({
					view: "text",
					value: phone.phone,
					label: "Phone "+(index+1),
					labelWidth: 100,
					name: "phone"+(index+1)
				});
			});
			form.setValues(response);
			counter = response.phones.length;
		});
	}
}
