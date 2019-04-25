import { JetView } from "webix-jet";
import WindowInfoView from "./bookfullinfo";
import PopularAuthorsView from "./popularauthors";

export default class DataView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "tabbar",
					localId: "mytabbar",
					options: [
						{id: 1, value: "All"},
						{id: 2, value: "the Oldest"},
						{id: 3, value: "Biggest (by pages)"},
						{id: 4, value: "Biggest title"},
						{id: 5, value: "Spain (1980 - 2000)"},
						{id: 6, value: "Popular authors"},
						{id: 7, value: "Audio and paper only"},
					],
					on: {
						onChange:() => {
							this.$$("library").filterByAll();
						}
					}
				},
				{
					view: "datatable",
					localId: "library",
					select: true,
					pager:"bottom",
					rowHeight: 80,
					scheme: {
						$change: function (item) {
							if (item.availableCount == 0) {
								item.$css = "highlight";
							}
						}
					},
					columns: [
						{
							id: "image", header: "Image", width: 100, template: (obj) => {
								let photo = "";
								if (obj.cover == "") {
									photo = "<img class='defaultPhoto'>";
								}
								else {
									photo = "<img src =" + obj.cover.path + " class='smallPhoto'>";
								}
								return "<div class='columnSettings'>" + photo + "</div>";
							}
						},
						{ id: "title", header:["Title", { content:"serverFilter"}], fillspace: true },
						{ id: "pages", header: "Pages" },
						{ id: "year", header: "Year" },
						{ id: "author", header: ["Author", { content:"serverFilter"}], fillspace: true, template: (obj) => {
							return obj.authorName + " " + obj.authorSurname + " " + obj.authorPatronymic;
						}
						},
						{
							id: "genres", header: "Genres", fillspace: true, template: (obj) => {
								let genres = " ";
								genres = obj.genres.map(function (genre) {
									return " " + genre.genre;
								});
								return genres;
							}
						},
						{ id: "publisher", header: "Publisher" },
						{ id: "country", header: "Country" },
						{ id: "availableCount", header: "Available count" },
						{ id: "buy", header: "Buy", template: (obj) => {
							if (obj.availableCount > 0) {
								return "<i class='fas fa-shopping-cart'></i>";
							}
							return "Not available";
						} }
					],
					onClick: {
						"fa-shopping-cart": (e, id) => {
							let values = this.$$("library").getItem(id);
							let data = {bookId: values.id};
							webix.ajax().post("http://localhost:3016/order/add", data);
							webix.message({text: "Your order of " + values.title + " is pending. Wait an answer from librarian..."});
						},
					},
					on: {
						onItemDblClick: (id) => {
							if (id.column !== "buy") {
								let values = this.$$("library").getItem(id.row);
								this.windowInfo.showWindow(values);
							}
						},
					},
					url: "http://localhost:3016/books",
					save: {
						url: "rest->http://localhost:3016/books/order",
						updateFromResponse: true
					},
					css: "webix_shadow_medium"
				},
				{
					view:"pager",
					id:"bottom",
					size: 10,
				},
			]
		};
	}
	init() {
		this.windowInfo = this.ui(WindowInfoView);
		this.windowPopularAuthors = this.ui(PopularAuthorsView);
		let windowAuthors = this.windowPopularAuthors;
		let filteringcolumn = "";
		let library = this.$$("library");
		this.$$("library").registerFilter(
			this.$$("mytabbar"),
			{
				columnId: "State",
				compare: function(value, filter) {
					switch(filter) {
						case "1":
							library.clearAll();
							filteringcolumn = "";
							library.load(library.config.url);
							break;
						case "2":
							library.clearAll();
							filteringcolumn = "year";
							library.load(library.config.url);
							break;
						case "3":
							library.clearAll();
							filteringcolumn = "pages";
							library.load(library.config.url);
							break;
						case "4":
							library.clearAll();
							filteringcolumn = "title";
							library.load(library.config.url);
							break;
						case "5":
							library.clearAll();
							filteringcolumn = "country";
							library.load(library.config.url);
							break;
						case "6":
							windowAuthors.showWindow();
							break;
						case "7":
							library.clearAll();
							filteringcolumn = "files";
							library.load(library.config.url);
							break;
					}
				}
			},
			{
				getValue:function(node){
					return node.getValue();
				},
				setValue:function(node, value){
					node.setValue(value);
				}
			}
		);
		webix.attachEvent("onBeforeAjax",
			function(mode, url, data, request, headers) {
				headers["filteringcolumn"] = filteringcolumn;
			}
		);
	}
}
