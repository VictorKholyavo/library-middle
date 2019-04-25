function status() {
	let token = null;
	if (webix.storage.local.get("UserInfo")) {
		token = webix.storage.local.get("UserInfo").token;
	}
	return webix.ajax().headers({
		"authorization" : "bearer " + token
	}).post("http://localhost:3016/users/login/status")
		.then((a) => {
			a = a.json();
			webix.storage.local.put("UserInfo", a);
			return a;
		});
}

function login(email, password){
	return webix.ajax().post("http://localhost:3016/users/login", {
		email, password
	}).then((a) => {
		a = a.json();
		webix.storage.local.put("UserInfo", a);
		return a;
	});
}

function logout() {
	return webix.ajax().post("http://localhost:3016/users/logout")
		.then((a) => {
			webix.storage.local.remove("UserInfo");
			a = a.json();
			return a;
		});
}

export default {
	status, login, logout
};
