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
					cols: [
						{
							view: "text",
							localId: "textField"
						},
	      		{
							view: "button",
							value: "Find by title",
							autowidth: true,
							hotkey: "Enter",
							click:() => {
								this.filterText()
							}
						}
					]
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
							id: "image",
							header: "Image",
							width: 100,
							template: (obj) => {
								let cover = "";
								if (obj.cover == "") {
									cover = "<img class='defaultPhoto'>";
								}
								else {
									cover = "<img src =" + obj.cover + " class='smallPhoto'>";
								}
								return "<div class='columnSettings'>" + cover + "</div>";
							}
						},
						{
							id: "title",
							header: "Title",
							fillspace: true
						},
						{
							id: "pages",
							header: "Pages"
						},
						{
							id: "year",
							header: "Year"
						},
						{
							id: "author",
							header: "Author",
							fillspace: true,
							template: (obj) => {
								return obj.authorName + " " + obj.authorSurname + " " + obj.authorPatronymic;
							}
						},
						{
							id: "genres",
							header: "Genres",
							fillspace: true,
							template: (obj) => {
								let genres = " ";
								genres = obj.genres.map(function (genre) {
									return " " + genre.name;
								});
								return genres;
							}
						},
						{ id: "publisher", header: "Publisher" },
						{ id: "country", header: "Country" },
						{ id: "availableCount", header: "Available count" },
						{
							id: "buy",
							header: "Buy",
							template: (obj) => {
								if (obj.availableCount > 0) {
									return "<i class='fas fa-shopping-cart'></i>";
								}
								return "Not available";
							}
						}
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
					url: "http://localhost:3016/booksmongo",
					save: {
						url: "rest->http://localhost:3016/books/order",
						updateFromResponse: true
					},
					datafetch: 10,
					css: "webix_shadow_medium"
				},
				{
					view:"pager",
					id:"bottom"
				},
			]
		};
	}

	filterText() {
		let text = this.$$("textField").getValue();
		this.setParam("search", text, true);
		this.$$("library").clearAll();
		this.$$("library").load(this.$$("library").config.url);
	}

	init() {
		this.windowInfo = this.ui(WindowInfoView);
		this.windowPopularAuthors = this.ui(PopularAuthorsView);
		let windowAuthors = this.windowPopularAuthors;
		let filteringcolumn = "";
		const root = this;
		let library = this.$$("library");
		library.registerFilter(
			this.$$("mytabbar"),
			{
				columnId: "State",
				compare: function(value, filter) {
					switch(filter) {
						case "1":
							filteringcolumn = "";
							break;
						case "2":
							filteringcolumn = "year";
							break;
						case "3":
							filteringcolumn = "pages";
							break;
						case "4":
							filteringcolumn = "title";
							break;
						case "5":
							filteringcolumn = "country";
							break;
						case "6":
							windowAuthors.showWindow();
							break;
						case "7":
							filteringcolumn = "files";
							break;
					}
					library.clearAll();
					library.load(library.config.url);
				}
			},
			{
				getValue:function(node) {
					return node.getValue();
				},
				setValue:function(node, value) {
					node.setValue(value);
				}
			}
		);
		webix.attachEvent("onBeforeAjax",
			function(mode, url, data, request, headers) {
				let params = root.getParam("search", true);
				if (params) {
					headers["filter"] = params;
				}
				headers["filteringcolumn"] = filteringcolumn;
			}
		);
	}
}
