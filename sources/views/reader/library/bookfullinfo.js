import {JetView} from "webix-jet";
import "../reader.css";

export default class WindowInfoView extends JetView {
	config() {
		return {
			view: "window",
			localId: "window",
			width: 1500,
			height: 700,
			position: "center",
			modal: true,
			borderless: true,
			head: {
				view: "toolbar", margin: -4, cols: [
					{view: "label", label: "", localId: "titleOfBook", template: " "},
					{
						view: "icon", icon: "wxi-close", click: () => {
							this.$$("window").hide();
						}
					}
				]
			},
			body: {
				borderless: true,
				cols: [
					{
						cols: [
							{
								rows: [
									{
										view: "covertemplate",
										width: 250,
										localId: "cover"
									},
									{
										view: "audio",
										name: "audio",
										localId: "audio"
									},
									{
										view: "button",
										value: "Print Cover",
										click: () => {
											webix.print(this.$$("cover"));
										}
									}
								]
							},
							{
								rows: [
									{
										view: "bookinfo",
										width: 300,
										localId: "info"
									},
									{
										view: "likes",
										localId: "likes",
										height: 60
									},
									{
										view: "button",
										value: "Like",
										click: () => {
											let bookId = webix.storage.local.get("bookId");
											let likes = this.$$("likes");
											webix.ajax().post("http://localhost:3016/like", {bookId: bookId}).then(response => {
												response = response.json();
												likes.setValue(response.likes);
											}, function (err) {
												webix.message({type: "error", text: err.responseText});
											});
										}
									}
								]
							},
						]
					},
					{
						view: "comments",
						localId: "commentsView",
						width: 300,
						users: "http://localhost:3016/users/comments",
						save: {
							url: (id, e, body) => {
								let bookId = webix.storage.local.get("bookId");
								return webix.ajax().post("http://localhost:3016/comments", {
									text: body.text,
									date: body.date,
									bookId: bookId
								});
							},
							updateFromResponse: true
						}
					}
				]
			},
			on: {
				onHide: () => {
					this.$$("commentsView").clearAll();
				}
			}
		};
	}

	showWindow(values) {
		this.$windowInfo().show();
		webix.storage.local.put("bookId", values.id);
		let user_id = webix.storage.local.get("UserInfo").user_id;
		let comments = this.$$("commentsView");
		let url = "http://localhost:3016/bookinfo/audio/" + values.id + "?Bearer=" + webix.storage.local.get("UserInfo").token + "";
		let genres = values.genres.map(genre => " " + genre.name);
		Promise.all(genres).then(() => {
			values.genres = genres;
			this.$$("info").setValue(values);
		});
		this.$$("likes").setValue(values.likes);
		webix.ajax().get("http://localhost:3016/comments/" + values.id).then(function (data) {
			data = data.json();
			comments.parse(data);
			comments.setCurrentUser(user_id);
		});
		this.$$("cover").setValue(values.cover);
		this.$$("audio").setValue(url);

		this.$$("titleOfBook").define({template: "<div class='headerInfo'>" + values.title + "</div>"});
		this.$$("titleOfBook").refresh();
	}

	$windowInfo() {
		return this.$$("window");
	}

	hideForm() {
		this.getRoot().hide();
	}
}
