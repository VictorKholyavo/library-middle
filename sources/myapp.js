import "./styles/app.css";
import {JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import session from "models/session";

export default class MyApp extends JetApp{
	constructor(config){
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			router 	: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug 	: !PRODUCTION,
			start 	: "/top"
		};

		super({ ...defaults, ...config });
		this.use(plugins.User, {
			model: session,
		});

		function getUser() {
			return webix.ajax().sync().post("http://localhost:3016/users/login/status").response;
		}
		this.attachEvent("app:guard", function(url, view, nav) {
			try {
				let userInfo = JSON.parse(getUser());
				switch(userInfo.role) {
					case "3":
						if (url.indexOf("/reader") !== -1 || url.indexOf("/librarian") !== -1 || url.indexOf("/top") !== -1) {
							nav.redirect = "/admin.adminMenu/admin.users"
						}
						break;
					case "2":
						if (url.indexOf("/admin") !== -1 || url.indexOf("/reader") !== -1 || url.indexOf("/top") !== -1) {
							nav.redirect = "/librarian.librarianMenu/librarian.library"
						}
						break;
					case "1":
						if (url.indexOf("/admin") !== -1 || url.indexOf("/librarian") !== -1 || url.indexOf("/top") !== -1) {
							nav.redirect = "/reader.readerMenu/reader.library"
						}
						break;
				}
			} catch (err) {
				console.log("You are not logged");
			}
		});
		webix.attachEvent("onBeforeAjax",
			function(mode, url, data, request, headers) {
				if (webix.storage.local.get("UserInfo")) {
					let token = webix.storage.local.get("UserInfo").token;
					headers["authorization"] = "bearer " + token;
				}
			}
		);
	}
}

if (!BUILD_AS_MODULE){
	webix.ready(() => new MyApp().render() );
}
