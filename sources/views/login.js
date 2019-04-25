import { JetView } from "webix-jet";

export default class FormView extends JetView {
	config() {
		const login_form = {
			rows: [
				{
					cols: [
						{
							view: "button",
							value: "Login",
							batch: "user",
							type: "form",
							click: () => {
								this.change_mode("authorization");
							},
						},
						{
							view: "button",
							value: "Registration",
							batch: "guest",
							type: "form",
							click: () => {
								this.change_mode("registration");
							}
						}
					]
				},
				{
					view: "form",
					localId: "login_form",
					width: 600,
					borderless: false,
					margin: 20,
					scroll: false,
					visibleBatch: "b1",
					elements: [
						{
							view: "text",
							localId: "email",
							name: "email",
							type: "email",
							batch: "b1",
							attributes: {
								required: true,
								title: "Email is required"
							},
							label: "Email",
							labelWidth: 120
						},
						{
							view: "text",
							localId: "password",
							type: "password",
							name: "password",
							required: true,
							batch: "b1",
							label: "Password",
							labelWidth: 120

						},
						{
							cols: [
								{
									view: "button",
									localId: "loginButton",
									value: "Login",
									batch: "b1",
									hotkey: "Enter",
									click: () => {
										this.do_login();
									}
								},
								{
									view: "button",
									localId: "registerButton",
									value: "Registration",
									batch: "b2",
									click: () => {
										let values = this.$getForm().getValues();
										let form = this.$getForm();
										const user = this.app.getService("user");
										webix.ajax().post("http://localhost:3016/users/registration", values).then(function () {
										}, function (err) {
											webix.message({ type: "error", text: err.responseText });
											form.clear();
											form.clearValidation();
										}).then(function () {
											user.login(values.email, values.password);
										});
									}
								},
								{
									view: "button",
									localId: "adminButton",
									value: "Register as admin",
									batch: "b2",
									click: () => {
										let values = this.$getForm().getValues();
										webix.ajax().post("http://localhost:3014/admins/addadmin", values);
										this.$getForm().clear();
										this.$getForm().clearValidation();
									}
								}
							]
						}
					],
					rules: {
						$all: webix.rules.isNotEmpty
					}
				}
			]
		};
		return {
			cols: [{}, { rows: [{}, login_form, {}] }, {}]
		};
	}
	change_mode(mode) {
		if (mode == "authorization") {
			this.$getForm().showBatch("b1");
			this.$getLoginButton().show();
			this.$getRegisterButton().hide();
			this.$getAdminButton().hide();
		}
		else {
			this.$getForm().showBatch("b2", true);
			this.$getLoginButton().hide();
			this.$getRegisterButton().show();
			this.$getAdminButton().show();
		}
		this.$getForm().clear();
		this.$getForm().clearValidation();
	}
	do_login() {
		let form = this.$getForm();
		const user = this.app.getService("user");

		if (this.$getForm().validate()) {
			const data = this.$getForm().getValues();
			user.login(data.email, data.password).catch(function (err) {
				webix.message({ type: "error", text: err.responseText });
				form.clear();
				form.clearValidation();
			});
		}
	}
	$getForm() {
		return this.$$("login_form");
	}
	$getLoginButton() {
		return this.$$("loginButton");
	}
	$getRegisterButton() {
		return this.$$("registerButton");
	}
	$getAdminButton() {
		return this.$$("adminButton");
	}
	init() {
		this.$getLoginButton().show();
		this.$getRegisterButton().hide();
		this.$getAdminButton().hide();
	}
}
