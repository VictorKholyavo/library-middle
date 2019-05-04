import {JetView} from "webix-jet";

export default class PopularAuthorsView extends JetView {
	config() {
		return {
			view: "window",
			localId: "window",
			width: 600,
			height: 450,
			position: "center",
			modal: true,
			borderless: true,
			head: {
				view:"toolbar",
				margin:-4,
				cols:[
					{ view:"label", label: "", localId: "titleOfBook", template: "Popular Authors" },
					{ view:"icon", icon:"wxi-close", click: () => { this.$$("window").hide(); } }
				]
			},
			body: {
				borderless: true,
				rows: [
					{
						view: "datatable",
						scroll: false,
						url: "http://localhost:3016/booksmongo/popularauthors",
						columns: [
							{id: "authorName", header: "Author", fillspace: true, template: (obj) => {
								return obj.authorName + " " + obj.authorSurname + " " + obj.authorPatronymic;
							}},
							{id: "count", header: "Books Count"},
						]
					}
				]
			}
		};
	}
	showWindow() {
		this.$windowPopularAuthors().show();
	}
	init() {
	}
	$windowPopularAuthors() {
		return this.$$("window");
	}
	hideForm() {
		this.getRoot().hide();
	}
}
