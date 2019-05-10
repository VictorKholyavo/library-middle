import {JetView} from "webix-jet";

export default class WindowInfoView extends JetView {
	config() {
		return {
			view: "window",
			localId: "window",
			width: 1200,
			height: 600,
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
										template: " ",
										width: 200,
										localId: "cover"
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
										template: " ",
										width: 300,
										localId: "info"
									},
									{
										view: "template",
										localId: "likes",
										template: "<div class='columnSettings'><div class='rowSettings'><span class='infoBodyHeader'>Likes: </span></div></div>",
										height: 60
									},
									{
										view: "button",
										value: "Like",
										click: () => {
											let bookId = webix.storage.local.get("bookId");
											let likes = this.$$("likes");
											webix.ajax().post("http://localhost:3016/bookFullInfo/like", {bookId: bookId}).then((response) => {
												response = response.json();
												likes.define({template: "<div class='columnSettings'><div class='rowSettings'><span class='infoBodyHeader'>Likes: " + response + "</span></div></div>"});
												likes.refresh();
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
						select: true,
						width: 300,
						users: "http://localhost:3016/users/comments",
						save: {
							url: (id, e, body) => {
								let bookId = webix.storage.local.get("bookId");
								return webix.ajax().post("http://localhost:3016/comments/addcomment", {
									text: body.text,
									date: body.date,
									bookId: bookId
								});
							},
							updateFromResponse: true
						}
					},
					{
						view: "button",
						value: "GET COMMENTS",
						click: () => {
							webix.ajax().get("http://localhost:3016/comments");
						}
					}
					// {
					// 	rows: [
					// 		{
					// 			template: "Answers: ",
					// 			height: 50,
					// 		},
					// 		{
					// 			view: "newComments",
					// 			localId: "answersView",
					// 			select: true,
					// 			width: 300,
					// 			users: "http://localhost:3016/users/comments",
					// 			save: {
					// 				url: (id, e, body) => {
					// 					let bookId = webix.storage.local.get("bookId");
					// 					let commentId = webix.storage.local.get("commentId");
					// 					return webix.ajax().post("http://localhost:3016/comments/answers/addanswer", {
					// 						text: body.text,
					// 						date: body.date,
					// 						parentId: commentId,
					// 						bookId: bookId
					// 					});
					// 				},
					// 				updateFromResponse: true
					// 			}
					// 		}
					// 	]
					// }
				]
			},
			on: {
				onHide: () => {
					this.$$("commentsView").clearAll();
				}
			}
		};
	}

	$getTree() {
		return this.$$("tree");
	}

	$getCommentTextArea() {
		return this.$$("commentTextArea");
	}

	answer(values) {
		let nameIndex = values.indexOf(",");
		values = values.slice(nameIndex + 3, -1);
		webix.ajax().post("http://localhost:3016/comments/addcomment" + values);
	}

	showWindow(values) {
		this.$windowInfo().show();
		let user_id = webix.storage.local.get("UserInfo").user_id;
		let genres = values.genres.map(function (genre) {
			return " " + genre.genre;
		});
		let comments = this.$$("commentsView");
		webix.storage.local.put("bookId", values.id);
		webix.ajax().get("http://localhost:3016/comments/" + values.id).then(function (data) {
			data = data.json();
			comments.parse(data);
			comments.setCurrentUser(user_id);
		});

		let image = "<img class='photo' src=" + values.cover + ">";
		this.$$("likes").define({template: "<div class='columnSettings'><div class='rowSettings'><span class='infoBodyHeader'>Likes: " + values.likes + "</span></div></div>"});
		this.$$("cover").define({template: "<div class='columnSettings'>" + image + "</div>"});
		this.$$("info").define({
			template: "<div class='columnSettings'><div class='rowSettings'><span class='infoBodyHeader'>Title: </span>" + values.title +
				"</div><div class='rowSettings'><span class='infoBodyHeader'>Author: </span>" + values.authorName + " " + values.authorSurname + " " + values.authorPatronymic +
				"</div><div class='rowSettings'><span class='infoBodyHeader'>Pages: </span>" + values.pages +
				"</div><div class='rowSettings'><span class='infoBodyHeader'>Year: </span>" + values.year +
				"</div><div class='rowSettings'><span class='infoBodyHeader'>Genres: </span>" + genres +
				"</div><div class='rowSettings'><span class='infoBodyHeader'>Publisher: </span>" + values.publisher +
				"</div><div class='rowSettings'><span class='infoBodyHeader'>Country: </span>" + values.country + "</div></div>"
		});
		this.$$("info").refresh();
		this.$$("likes").refresh();
		this.$$("titleOfBook").define({template: "<div class='headerInfo'>" + values.title + "</div>"});
		this.$$("titleOfBook").refresh();
		this.$$("cover").refresh();
	}

	init() {
	}

	$windowInfo() {
		return this.$$("window");
	}

	hideForm() {
		this.getRoot().hide();
	}
}
