import { JetView } from "webix-jet";

export default class ReadersDatatableView extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "readersDatatable",
			editable: true,
			select: true,
			columns: [
				{ id: "userId", header: "id of user" },
				{ id: "firstname", editor: "text",  fillspace: true, header: "Firstname" },
				{ id: "surname", editor: "text", header: "Surname", fillspace: true },
				{ id: "patronymic", editor: "text", header: "Patronymic", fillspace: true },
				{ id: "passport", editor: "text", header: "Passport" },
				{ id: "dateofbirth", header: "Date of Birth" },
				{ id: "address", header: "Address", fillspace: true },
				{ id: "cardnumber", header: "Card number", fillspace: true }
			],
			url: "http://localhost:3016/users/readers",
			save: {
				url: "rest->http://localhost:3016/users/readers",
				updateFromResponse: true
			}
		};
	}
}
