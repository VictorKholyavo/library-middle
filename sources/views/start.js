import {JetView} from "webix-jet";

export default class DataView extends JetView{
	config(){
		return { 
			view: "button", 
			value: "Logout", 
			click: () => {
				this.do_logout();
				window.location.reload(true);
			}
		};
	}
	do_logout() {
		const user = this.app.getService("user");
		user.logout().catch(function () {
			//error handler
		});
	}
	init(){
	}
}