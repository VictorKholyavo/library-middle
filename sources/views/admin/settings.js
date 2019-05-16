import {JetView, plugins} from "webix-jet";
import "./admin.css";

export default class SettingView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "template",
					template: "Settings",
					css: "header-template",
					autoheight: true
				},
				{
					cols: [
						{
							rows: [
								{
									view: "template",
									template: "Login settings",
									css: "header-template",
								}
							]
						},
						{

						}
					]
				}
			]
		};
	}
}