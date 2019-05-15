import {JetView, plugins} from "webix-jet";

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
				{value: "Users", id: "admin.users", icon: "wxi-columns"}
			]
		};

		const ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				{
					paddingX: 5,
					paddingY: 10,
					rows: [
						{
							type: "toolbar",
							localId: "toolbar",
							margin: 20,
							paddingX: 10,
							cols: [
								{view: "template", localId: "helloTemplate", template: " ", width: 240},
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
							css: "webix_shadow_medium",
							cols: [
								menu,
								{$subview: true}
							]
						}
					]
				},
				{
					type: "wide",
					paddingY: 10,
					paddingX: 5,
					rows: []
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
