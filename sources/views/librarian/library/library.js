import { JetView } from "webix-jet";
import EditFormView from "./editbook";

export default class LibraryView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "datatable",
					localId: "library",
					select: true,
					rowHeight: 80,
					pager:"bottom",
					columns: [
						{id: "image", header: "Image", width: 100, template: (obj) => {
							let photo = "";
							if (obj.cover == "") {
								photo = "<img class='defaultPhoto'>";
							}
							else {
								photo = "<img src ="+obj.cover+" class='smallPhoto'>";
							}
							return "<div class='columnSettings'>"+ photo +"</div>";
						}},
						{ id: "title", editor: "text", header: "Title", fillspace: true },
						{ id: "pages", editor: "text", header: "Pages" },
						{ id: "year", editor: "text", header: "Year" },
						{ id: "author", editor: "text", header: "Author", fillspace: true, template: (obj) => {
							return obj.authorName + " " + obj.authorSurname + " " + obj.authorPatronymic;
						}
						},
						{ id: "genres", header: "Genres", fillspace: true, template: (obj) => {
							let genres = " ";
							genres = obj.genres.map(function (genre) {
								return " " + genre.name;
							});
							return genres;
						}},
						{ id: "publisher", editor: "text", header: "Publisher" },
						{ id: "country", editor: "text", header: "Country" },
						{ id: "availableCount", editor: "text", header: "Available count" },
					],
					url: "http://localhost:3016/booksmongo",
					save: {
						url: "rest->http://localhost:3016/booksmongo",
						updateFromResponse: true
					},
					on: {
						onItemDblClick: () => {
							const form = this.EditFormView;
							const datatable = this.$getDatatable();
							const values = datatable.getSelectedItem();
							form.showWindow(values, function (data) {
								datatable.updateItem(data.id, data);
								form.hide();
							});
						},
					}
				},
				{
					view:"pager",
					id:"bottom",
					size: 10
				}
			]
		};
	}

	$getDatatable() {
		return this.$$("library");
	}

	init() {
		this.EditFormView = this.ui(EditFormView);
		webix.attachEvent("onBeforeAjax",
			function(mode, url, data, request, headers) {
				headers["filteringcolumn"] = "";
			}
		);
	}
}
