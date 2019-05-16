import {JetView, plugins} from "webix-jet";
import "./admin.css";

export default class TopView extends JetView {
	config() {
		const menu = {
			view: "menu",
			localId: "top:adminmenu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "Users", id: "admin.users", icon: "wxi-columns"},
				{value: "Settings", id: "admin.settings", icon: "fas fa-cogs"}
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
							margin: 20,
							paddingX: 10,
							cols: [
								{
									view: "template",
									localId: "helloTemplate",
									css: "hello-template",
									template: " ",
									width: 300,
									borderless: true
								},
								{},
								{
									view: "button",
									value: "Logout",
									width: 150,
									click: () => {
										this.do_logout();
									}
								}
							],
							css: "webix_dark"
						},
						{
							cols: [
								menu,
								{$subview: true}
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
		this.$getHelloTemplate().define({template: "Hi, " + username + ". You are admin"});
		this.$getHelloTemplate().refresh();
		this.use(plugins.Menu, this.$$("top:adminmenu"));
	}
}
