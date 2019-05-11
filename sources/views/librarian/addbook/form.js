import {JetView} from "webix-jet";
import Inputs from "./inputs";
import "../librarian.css";

let counter = 1;

export default class FormView extends JetView {
	config() {
		return {
			cols: [
				{
					rows: [
						{
							view: "form",
							localId: "form",
							minWidth: 700,
							padding: 60,
							borderless: true,
							elements: [
								{
									cols: [
										{},
										{
											localId: "inputsForForm",
											...Inputs
										},
										{}
									]
								}
							]
						},
						{css: "spacerOfAddBook"},
						{css: "spacerOfAddBook"},
						{css: "spacerOfAddBook"},
						{
							cols: [
								{
									view:"list",
									id: "mylist",
									type:"uploader",
									autoheight:true,
									borderless:true
								},
								{
									rows: [
										{},
										{
											view:"uploader",
											localId:"uploader_1",
											css: "addbook-button",
											value: "Upload cover",
											width: 250,
											link: "mylist",
											upload: "http://localhost:3016/books",
											autosend: false,
											accept:"image/png, image/gif, image/jpg",
											multiple: false,
										}
									]
								},
								{
									view: "button",
									value: "Add one more genre",
									css: "addbook-button",
									width: 250,
									click: () => {
										counter++;
										this.$$("inputsForForm").addView({
											view: "richselect",
											label: "Genre "+counter,
											labelWidth: 140,
											name: "genre_"+counter,
											options: {
												body: {
													template: "#name#",
													url:"http://localhost:3016/books/genres",
												}
											},
										});
									}
								},
								{
									view: "button",
									localId: "saveButton",
									type: "form",
									width: 250,
									css: "addbook-button",
									value: "Save",
									click: () => {
										const values = this.$$("form").getValues();
										this.saveProduct(values);
									}
								},
								{css: "spacerOfAddBook"},
							]
						},
					]
				}
			]
		};
	}

	$getForm() {
		return this.$$("form");
	}

	saveProduct(values) {
		if (this.$getForm().validate()) {
			this.$$("uploader_1").files.data.each(function (obj) {
				obj.formData = values;
			});
			this.$$("uploader_1").send();
			this.$getForm().clear();
			this.$getForm().clearValidation();
		}
		else {
			webix.message({ type:"error", text:"Invalid info" });
		}
	}
}
