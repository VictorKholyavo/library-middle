import { JetView, plugins } from "webix-jet";
import "./librarian.css";

export default class LibrarianMenu extends JetView {
	config() {
		const menu = {
			view: "menu",
			localId: "top:librarianmenu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{
					value: "Library",
					id: "librarian.library.library",
					icon: "fas fa-book"
				},
				{
					value: "Add Book",
					id: "librarian.addbook",
					icon: "fas fa-plus-square"
				},
				{
					value: "Orders",
					id: "librarian.orders",
					icon: "fas fa-shopping-basket"
				},
				{
					value: "Readers",
					id: "librarian.readersDatatable",
					icon: "fas fa-users"
				}
			]
		};

		const ui = {
			type: "clean",
			css: "app_layout",
			rows: [
				{
					rows: [
						{
							type: "toolbar",
							localId: "toolbar",
							cols: [
								{
									view: "template",
									localId: "helloTemplate",
									template: " ",
									css: "hello-template",
									borderless: true,
									width: 240
								},
								{},
								{
									view: "button",
									value: "MAIL",
									width: 250,
									click: () => { webix.ajax().get("http://localhost:3016/mailing"); }
								},
								{
									view: "button",
									value: "Personal Information",
									width: 250,
									click: () => { this.show("personalPage"); }
								},
								{
									view: "button",
									value: "Logout",
									width: 150,
									click: () => {this.do_logout();
										window.location.reload(true);
									}
								}
							],
							css: "webix_dark"
						},
						{
							cols: [
								menu,
								{
									$subview: true
								}
							]
						}
					]
				}
			]
		};

		return ui;
	}
	$getHelloTemplate() {
		return this.$$("helloTemplate");
	}
	do_logout() {
		const user = this.app.getService("user");
		user.logout();
	}
	init() {
		let username = webix.storage.local.get("UserInfo").username;
		this.$getHelloTemplate().define({template: "Hi, " + username + ". You are librarian"});
		this.$getHelloTemplate().refresh();
		this.use(plugins.Menu, this.$$("top:librarianmenu"));
	}
}
