import { JetView } from "webix-jet";

export default class OrdersView extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "orders",
			select: true,
			rowHeight: 80,
			editable: true,
			columns: [
				{
					id: "cover", header: "Image", width: 100, template: (obj) => {
						let photo = "<img src =" + obj.cover.path + " class='smallPhoto'>";
						return "<div class='columnSettings'>" + photo + "</div>";
					}
				},
				{ id: "cardnumber", fillspace: true, header: "Card of user", template: (obj) => obj.user.cardnumber },
				{ id: "title", header: "Title", fillspace: true, template: (obj) => obj.book.title },
				{ id: "year", header: "Year", template: (obj) => obj.book.year },
				{ id: "author", header: "Author", template: (obj) => {
					return obj.authorName + " " + obj.authorSurname;
				}
				},
				{ id: "publisher", header: "Publisher", template: (obj) => obj.book.publisher },
				{ id: "availableCount", header: "Available Count", template: (obj) => obj.book.availableCount },
				{ id: "status", header: "Status", template: (obj) => obj.status.status, editor: "richselect", options: "http://localhost:3016/status" },
				{ id: "returnBook", header: "return Book", template: (obj) => {
					if (obj.statusId == "4") {
						return "<div class='webix_el_button'><button class='webixtype_base'>Accept returning</button></div>";
					}
					return " ";
				}
				},
			],
			onClick:{
				webixtype_base: (e, id) => {
					let data = {status: 5, return: true};
					this.$getDatatable().updateItem(id.row, data);
					this.$getDatatable().remove(id.row);
					return false;
				}
			},
			url: "http://localhost:3016/order",
			save: {
				url: "rest->http://localhost:3016/order",
				updateFromResponse: true
			}
		};
	}
	$getDatatable() {
		return this.$$("orders");
	}
}
