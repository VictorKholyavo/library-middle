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
						let photo = "<img src =" + obj.book.cover + " class='smallPhoto'>";
						return "<div class='columnSettings'>" + photo + "</div>";
					}
				},
				{ id: "cardnumber", fillspace: true, header: "Card of user", template: (obj) => obj.user.userdetaile.cardnumber },
				{ id: "title", header: "Title", fillspace: true, template: (obj) => obj.book.title },
				{ id: "year", header: "Year", template: (obj) => obj.book.year },
				{ id: "author", header: "Author", template: (obj) => {
					return obj.book.authorName + " " + obj.book.authorSurname + " " + obj.book.authorPatronymic;
				}
				},
				{ id: "publisher", header: "Publisher", template: (obj) => obj.book.publisher },
				{ id: "availableCount", header: "Available Count", template: (obj) => obj.book.availableCount },
				{ id: "statusId", header: "Status", template: (obj) => obj.status.status, editor: "richselect", options: "http://localhost:3016/status" },
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
					let data = {statusId: 5, return: true};
					// this.$getDatatable().updateItem(id.row, data);
					this.$getDatatable().remove(id.row);
					return false;
				}
			},
			url: "http://localhost:3016/orders/all",
			save: {
				url: "rest->http://localhost:3016/orders/all",
				updateFromResponse: true
			}
		};
	}
	$getDatatable() {
		return this.$$("orders");
	}
}
