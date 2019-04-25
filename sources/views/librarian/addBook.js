import {JetView} from "webix-jet";
import "./librarian.css";

let counter = 1;

export default class FormforBookView extends JetView {
	config() {
		return {
			type: "space",
			cols: [
				{
					rows: [
						{
							view: "form",
							localId: "form",
							borderless: true,
							elements: [
								{
									rows: [
										{
											view: "text",
											name: "title",
											label: "Title",
											labelWidth: 120,
										},
										{
											view: "text",
											name: "pages",
											label: "Pages",
											labelWidth: 120,
										},
										{
											view: "text",
											name: "year",
											label: "Year",
											labelWidth: 120,
										},
										{
											view: "text",
											name: "author",
											label: "Author",
											labelWidth: 120,
										},
										{
											view: "text",
											name: "publisher",
											label: "Publisher",
											labelWidth: 120,
										},
										{
											view: "text",
											name: "country",
											label: "Country",
											labelWidth: 120,
										},
										{
											view: "text",
											name: "availableCount",
											label: "Available count",
											labelWidth: 120,
										},
										{
											view: "richselect",
											label: "Genre 1",
											labelWidth: 120,
											name: "genre1",
											options:{
												body: {
													template: "#genre#",
													url:"http://localhost:3016/genres",
												}
											},
										}
									]
								}
							]
						},
						{css: "spacerOfAddBook"},{css: "spacerOfAddBook"},{css: "spacerOfAddBook"},{css: "spacerOfAddBook"},
					]
				},
				// {
				// 	view: "template",
				// 	localId: "coverOfBook",
				// 	name: "coverOfBook",
				// 	template: (obj)=> {
				// 		let photo = "";
				// 		if (obj.src) {
				// 			photo = "<img class='photo' src="+obj.src+">";
				// 		}
				// 		if (obj.src == "defaultPhoto") {
				// 			photo = "<img class='defaultPhotoBig'>";
				// 		}
				// 		return photo;
				// 	},
				// },
				{
					rows: [
						{
							view: "button",
							value: "Add one more genre",
							css: "addbook-button",
							click: () => {
								counter++;
								this.$getForm().addView({
									view: "richselect",
									label: "Genre "+counter,
									labelWidth: 120,
									name: "genre"+counter,
									options:{
										body: {
											template: "#genre#",
											url:"http://localhost:3016/genres",
										}
									},
								});
							}
						},
						{css: "spacerOfAddBook"},
						{
							view: "list",
							id: "listOfFiles",
							type: "uploader",
							autoheight:true,
							borderless:true
						},
						{
							view:"uploader",
							localId:"uploader_1",
							css: "addbook-button",
							value: "Upload cover",
							link: "listOfFiles",
							upload: "http://localhost:3016/books/add",
							autosend: false,
							accept:"image/png, image/gif, image/jpg",
							multiple: false,
							on: {
								onFileUpload: (response) => {
									this.$getTemplateCoverOfBook().setValues({src: response.path});
									this.$getTemplateCoverOfBook().refresh();
								}
							}
						},
						{
							view: "button",
							localId: "saveButton",
							width: 300,
							css: "addbook-button",
							value: "Save",
							click: () => {
								const values = this.$$("form").getValues();
								this.saveProduct(values);
							}
						}
					]
				},
			]

		};
	}
	$getTemplateCoverOfBook() {
		return this.$$("coverOfBook");
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
	$getForm() {
		return this.$$("form");
	}
}
