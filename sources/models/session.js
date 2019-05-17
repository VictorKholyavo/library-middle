import {state} from "../helpers/state.js";

function status() {
	let token = null;
	if (webix.storage.local.get("UserInfo")) {
		token = webix.storage.local.get("UserInfo").token;
	}
	return webix.ajax().headers({
		"authorization" : "bearer " + token
	}).post("http://localhost:3016/auth/status")
		.then(response => {
			response = response.json();
			webix.storage.local.put("UserInfo", response);
			return response;
		});
}

function login(email, password){
	return webix.ajax().post("http://localhost:3016/auth/signin", {
		email, password
	}).then(response => {
		response = response.json();
		webix.storage.local.put("UserInfo", response);
		// state.setState(response);
		return response;
	});
}

function logout() {
	return webix.ajax().post("http://localhost:3016/auth/signout")
		.then(response => {
			webix.storage.local.remove("UserInfo");
			response = response.json();
			window.location.reload(true);
			return response;
		});
}

export default {
	status, login, logout
};
