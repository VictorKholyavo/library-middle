import {JetView} from "webix-jet";

export default class OrderedBooksView extends JetView{
	config(){
		return {
			view: "datatable",
			localId: "orderedBooks",
			select: true,
			rowHeight: 80,
			columns: [
				{id: "cover", header: "Image", width: 100, template: (obj) => {

					let photo = "<img src ="+obj.cover.path+" class='smallPhoto'>";
					return "<div class='columnSettings'>"+ photo +"</div>";
				}},
				{ id: "title", header: "Title", fillspace: true, template: (obj) => obj.book.title },
				{ id: "pages", header: "Pages", template: (obj) => obj.book.pages },
				{ id: "year", header: "Year", template: (obj) => obj.book.year },
				{ id: "author", header: "Author", template: (obj) => obj.book.author },
				{ id: "publisher", header: "Publisher", template: (obj) => obj.book.publisher },
				{ id: "country", header: "Country", template: (obj) => obj.book.country },
				{ id: "status", header: "Status", template: (obj) => obj.status.status },
				{ id: "returnBook", header: "return Book", template: (obj) => {
					if (obj.statusId == "2") {
						return "<div class='webix_el_button'><button class='webixtype_base'>Return book</button></div>";
					}
					return " ";
				}
				},
			],
			onClick:{
				webixtype_base: (e, id) => {
					let data = {status: 4};
					this.$getDatatable().updateItem(id.row, data);
				}
			},
			url: "http://localhost:3016/order/user",
			save: {
				url: "rest->http://localhost:3016/order/user",
				updateFromResponse: true
			},
			css: "webix_shadow_medium"
		};
	}
	$getDatatable() {
		return this.$$("orderedBooks");
	}
	init(){
	}
}
