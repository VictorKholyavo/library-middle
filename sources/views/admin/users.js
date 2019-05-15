import { JetView } from "webix-jet";

export default class DataView extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "usersEditTable",
			editable: true,
			select: true,
			columns: [
				{ id: "userId", header: "id", width: 25 },
				{ id: "firstname", editor: "text", header: "Firstname", fillspace: true },
				{ id: "surname", editor: "text", header: "Surname", fillspace: true },
				{ id: "patronymic", editor: "text", header: "Patronymic", fillspace: true },
				{ id: "passport", editor: "text", header: "Passport" },
				{ id: "dateofbirth", header: "Date of Birth", fillspace: true },
				{ id: "address", header: "Address", fillspace: true },
				{ id: "phonesCount", header: "Phones (count)" },
				{ id: "cardnumber", header: "Card number" },
				// {
				// 	id: "role", header: "Role", editor: "richselect", options: "http://localhost:3016/roles", template: (obj) => {
				// 		console.log(obj.role);
				// 		return obj.role.role;
				// 	}
				// },
			],
			url: "http://localhost:3016/usersinfotoadmin",
			save: {
				url: "rest->http://localhost:3016/usersinfotoadmin",
				updateFromResponse: true
			},
			css: "webix_shadow_medium"
		};
	}
}
