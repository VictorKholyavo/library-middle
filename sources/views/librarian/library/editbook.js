import { JetView } from "webix-jet";
import Inputs from "./editform/inputs";

let counter = 0;

export default class EditFormView extends JetView {
	config() {

		const form = {
			view: "form",
			localId: "form",
			scroll: false,
			elements: [
				Inputs
			],
			rules: {
				$all: webix.rules.isNotEmpty
			}
		};

		const textFilesForm = {
			width: 270,
			cols: [
				{
					rows: [
						{
							view: "list",
							id: "listOfTextFiles",
							type: "uploader",
							autoheight:true,
							borderless:true
						},
						{},
						{
							view:"uploader",
							localId:"uploader_text",
							value: "Upload texts",
							link: "listOfTextFiles",
							upload: "http://localhost:3016/books/uploadfiles",
							autosend: false,
							inputName: "text"
						}
					]
				},
			]
		};

		const audioFilesForm = {
			width: 270,
			cols: [
				{
					rows: [
						{
							view: "list",
							id: "listOfAudioFiles",
							type: "uploader",
							autoheight:true,
							borderless:true
						},
						{},
						{
							view:"uploader",
							localId:"uploader_audio",
							value: "Upload audio",
							link: "listOfAudioFiles",
							upload: "http://localhost:3016/books/uploadfiles",
							autosend: false,
							inputName: "audio",
						}
					]
				},
			]
		};

		const addGenreButton = {
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
									url:"http://localhost:3016/books/genres",
								}
							},
						});
					}
				}
			]
		};

		const saveButton = {
			view: "button",
			localId: "updateButton",
			type: "form",
			value: "Save",
			hotkey: "Enter",
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
					{ template: " ", type: "header", localId: "formTemplate" },
					{
						view: "icon", icon: "wxi-close", click: () => {
							this.$$("popup").hide();
						}
					}
				]
			},
			body: {
				rows: [
					{
						cols: [
							textFilesForm,
							{rows: [form, addGenreButton]},
							audioFilesForm
						]
					},
					saveButton
				]
			},
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
							url:"http://localhost:3016/books/genres",
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
