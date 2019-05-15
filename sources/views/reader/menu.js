import {JetView, plugins} from "webix-jet";
import "./reader.css";

export default class TopView extends JetView {
	config() {
		const menu = {
			view: "menu",
			localId: "top:readermenu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{
					value: "Library",
					id: "reader.library.library",
					icon: "fas fa-book"
				},
				{
					value: "Ordered Books",
					id: "reader.orders.orders",
					icon: "fas fa-shopping-basket"
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
									borderless: true,
									css: "hello-template",
									width: 240
								},
								{},
								{
									view: "button",
									value: "GET",
									width: 250,
									click: () => {
										webix.ajax().get("http://localhost:3016/books/popularauthors").then(response => {
											response = response.json();
											console.log(response);
										});
									}
								},
								{
									view: "button",
									value: "Personal Information",
									width: 250,
									click: () => {
										this.show("personalPage");
									}
								},
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
		this.$getHelloTemplate().define({template: "Hi, " + username + ". You are reader"});
		this.$getHelloTemplate().refresh();
		this.use(plugins.Menu, {
			id: this.$$("top:readermenu")
		});
	}
}
