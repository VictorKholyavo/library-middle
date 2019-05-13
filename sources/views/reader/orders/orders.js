import {JetView} from "webix-jet";

export default class OrderedBooksView extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "orderedBooks",
			select: true,
			rowHeight: 80,
			columns: [
				{
					id: "cover", header: "Image", width: 100, template: (obj) => {
						let photo = "<img src =" + obj.book.cover + " class='smallPhoto'>";
						return "<div class='columnSettings'>" + photo + "</div>";
					}
				},
				{id: "title", header: "Title", fillspace: true, template: (obj) => obj.book.title},
				{id: "pages", header: "Pages", template: (obj) => obj.book.pages},
				{id: "year", header: "Year", template: (obj) => obj.book.year},
				{
					id: "author",
					header: "Author",
					fillspace: true,
					template: (obj) => obj.book.authorName + " " + obj.book.authorSurname + " " + obj.book.authorPatronymic
				},
				{id: "publisher", header: "Publisher", template: (obj) => obj.book.publisher},
				{id: "country", header: "Country", template: (obj) => obj.book.country},
				{id: "statusId", header: "Status", template: (obj) => obj.status.status},
				{
					id: "returnBook", header: "return Book", template: (obj) => {
						if (obj.statusId == "2") {
							return "<div class='webix_el_button'><button class='webixtype_base'>Return book</button></div>";
						}
						return " ";
					}
				},
			],
			onClick: {
				webixtype_base: (e, id) => {
					let data = {statusId: 4};
					this.$getDatatable().updateItem(id.row, data);
				}
			},
			url: "http://localhost:3016/orders",
			save: {
				url: "rest->http://localhost:3016/orders",
				updateFromResponse: true
			}
		};
	}

	$getDatatable() {
		return this.$$("orderedBooks");
	}
}
