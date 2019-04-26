import { JetView } from "webix-jet";

let counter = 0;

export default class EditFormView extends JetView {
	config() {
		const form = {
			view: "form",
			localId: "form",
			scroll: false,
			elements: [
				{
					view: "text",
					name: "title",
					label: "Title",
					labelWidth: 140
				},
				{
					view: "text",
					name: "pages",
					label: "Pages",
					labelWidth: 140
				},
				{
					view: "text",
					name: "year",
					label: "Year",
					labelWidth: 140
				},
				{
					view: "text",
					name: "authorName",
					label: "Author Name",
					labelWidth: 140
				},
				{
					view: "text",
					name: "authorSurname",
					label: "Author Surname",
					labelWidth: 140
				},
				{
					view: "text",
					name: "authorPatronymic",
					label: "Author Patronymic",
					labelWidth: 140
				},
				{
					view: "text",
					name: "publisher",
					label: "Publisher",
					labelWidth: 140
				},
				{
					view: "text",
					name: "country",
					label: "Country",
					labelWidth: 140
				},
				{
					view: "text",
					name: "availableCount",
					label: "Available Count",
					labelWidth: 140
				},
			],
			rules: {
				$all: webix.rules.isNotEmpty
			}
		};

		const uploaders = {
			cols: [
				{
					rows: [
						{
							view:"uploader",
							localId:"uploader_text",
							value: "Upload texts",
							link: "listOfTextFiles",
							upload: "http://localhost:3016/books/uploadFiles",
							autosend: false,
							inputName: "text"
						},
						{
							view: "list",
							id: "listOfTextFiles",
							type: "uploader",
							autoheight:true,
							borderless:true
						},
					]
				},
				{
					rows: [
						{
							view:"uploader",
							localId:"uploader_audio",
							value: "Upload audio",
							link: "listOfAudioFiles",
							upload: "http://localhost:3016/books/uploadFiles",
							autosend: false,
							inputName: "audio",
						},
						{
							view: "list",
							id: "listOfAudioFiles",
							type: "uploader",
							autoheight:true,
							borderless:true
						},
					]
				}
			]
		};
		const buttons = {
			cols: [
				{
					view: "button",
					value: "Add one more genre",
					click: () => {
						counter++;
						this.$getForm().addView({
							view: "richselect",
							label: "Genre "+counter,
							localId: "genre_"+counter,
							labelWidth: 140,
							name: "genre_"+counter,
							options:{
								body: {
									template: "#name#",
									url:"http://localhost:3016/genresmongo",
								}
							},
						});
					}
				},
				{
					view: "button",
					localId: "updateButton",
					value: "Save",
					hotkey: "Enter",
					click: () => {
						const values = this.$getForm().getValues();
						this.onSubmit(values);
					}
				}
			]
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
					{ template: " ", type: "header", localId: "formTemplate" },
					{
						view: "icon", icon: "wxi-close", click: () => {
							this.$$("popup").hide();
						}
					}
				]
			},
			body: {rows: [form, buttons, uploaders]},
			on: {
				onHide: () => {
					this.$getForm().clear();
					this.$getForm().clearValidation();
					for (let i = 1; i < counter + 1; i++) {
						this.$getForm().removeView(this.$$("genre_"+i));
					}
				}
			}
		};
	}
	
	showWindow(values, filled) {
		let formTemplate = this.$$("formTemplate");
		this.getRoot().show();
		let form = this.$getForm();
		let uploader_text = this.$$("uploader_text");
		let uploader_audio = this.$$("uploader_audio");
		if (values) {
			values.genres.map(function (genre, index) {
				values["genre_"+(index+1)] = genre.id;
				form.addView({
					view: "richselect",
					name: "genre_"+(index+1),
					label: "Genre "+(index+1),
					localId: "genre_"+(index+1),
					labelWidth: 140,
					options:{
						body: {
							template: "#name#",
							url:"http://localhost:3016/genresmongo",
						}
					},
				});
			});
			this.$getForm().setValues(values);
			counter = values.genres.length;
			formTemplate.define({ template: "Edit book" });
		}
		formTemplate.refresh();
		this.onSubmit = function (data) {
			if (this.$getForm().validate()) {
				uploader_text.files.data.each(function (obj) {
					obj.formData = data;
				});
				uploader_text.send();
				uploader_audio.files.data.each(function (obj) {
					obj.formData = values;
				});
				uploader_audio.send();
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
