import {JetView} from "webix-jet/dist/index";
import MailForm from "./mailForm";

export default class ReadersDatatableView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "datatable",
					localId: "readersDatatable",
					editable: true,
					editaction: "dblclick",
					select: "row",
					multiselect: true,
					columns: [
						{id: "userId", header: "id of user"},
						{id: "firstname", editor: "text", fillspace: true, header: "Firstname"},
						{id: "surname", editor: "text", header: "Surname", fillspace: true},
						{id: "patronymic", editor: "text", header: "Patronymic", fillspace: true},
						{id: "passport", editor: "text", header: "Passport"},
						{id: "dateofbirth", header: "Date of Birth"},
						{id: "address", header: "Address", fillspace: true},
						{id: "cardnumber", header: "Card number", fillspace: true}
					],
					url: "http://localhost:3016/users/readers",
					save: {
						url: "rest->http://localhost:3016/users/readers",
						updateFromResponse: true
					}
				},
				{
					view: "button",
					value: "Send mail",
					type: "form",
					click: () => {
						let selectedUsersIds = this.$$("readersDatatable").getSelectedId(true).join().split(",");
						const form = this.MailForm;
						form.showWindow(selectedUsersIds, function (data) {
							let sendData = {subject: data.subject, text: data.text, users: selectedUsersIds};
							webix.ajax().post("http://localhost:3016/mailing", sendData);
							form.hide();
						});
					}
				}
			]
		};
	}
	init() {
		this.MailForm = this.ui(MailForm);
	}
}
