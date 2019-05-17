import "./styles/app.css";
import {JetApp, EmptyRouter, HashRouter, plugins} from "webix-jet";
import {state} from "helpers/state.js";
import session from "models/session";
import "./components";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: !PRODUCTION,
			start: "/top",
			routes: {
				"library": "/reader.menu/reader.library.library",
				"users": "/admin.menu/admin.users"
			}
		};

		super({...defaults, ...config});
		this.use(state);
		this.use(plugins.User, {
			model: session,
		});

		function getUser() {
			const userInfo =  webix.ajax().sync().post("http://localhost:3016/auth/status").response;
			// root.getService("state").setState(userInfo);
			return userInfo;
		}

		this.attachEvent("app:guard", function (url, view, nav) {
			try {
				let userInfo = JSON.parse(getUser());
				switch (userInfo.role) {
					case "3":
						if (url.indexOf("/reader") !== -1 || url.indexOf("/librarian") !== -1 || url.indexOf("/top") !== -1 || url.indexOf("login") !== -1) {
							nav.redirect = "/admin.menu/admin.users"
						}
						break;
					case "2":
						if (url.indexOf("/admin") !== -1 || url.indexOf("/reader") !== -1 || url.indexOf("/top") !== -1 || url.indexOf("login") !== -1) {
							nav.redirect = "/librarian.menu/librarian.library.library"
						}
						break;
					case "1":
						if (url.indexOf("/admin") !== -1 || url.indexOf("/librarian") !== -1 || url.indexOf("/top") !== -1 || url.indexOf("login") !== -1) {
							nav.redirect = "/reader.menu/reader.library.library"
						}
						break;
				}
			} catch (err) {
				webix.message({type: "error", text: "You are not logged"});
			}
		});
		webix.attachEvent("onBeforeAjax",
			function (mode, url, data, request, headers) {
				if (webix.storage.local.get("UserInfo")) {
					let token = webix.storage.local.get("UserInfo").token;
					headers["authorization"] = "bearer " + token;
				}
			}
		);
	}
}

if (!BUILD_AS_MODULE) {
	webix.ready(() => new MyApp().render());

}
