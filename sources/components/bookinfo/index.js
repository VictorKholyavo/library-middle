webix.protoUI({
	name: "bookinfo",
	defaults: {
		width: 250,
		height: 250,
		borderless: true,
		template:(obj) => {
			return "<div class='columnSettings'><div class='rowSettings'><span class='infoBodyHeader'>Title: </span>" + obj.title +
			"</div><div class='rowSettings'><span class='infoBodyHeader'>Author: </span>" + obj.authorName + " " + obj.authorSurname + " " + obj.authorPatronymic +
			"</div><div class='rowSettings'><span class='infoBodyHeader'>Pages: </span>" + obj.pages +
			"</div><div class='rowSettings'><span class='infoBodyHeader'>Year: </span>" + obj.year +
			"</div><div class='rowSettings'><span class='infoBodyHeader'>Genres: </span>" + obj.genres +
			"</div><div class='rowSettings'><span class='infoBodyHeader'>Publisher: </span>" + obj.publisher +
			"</div><div class='rowSettings'><span class='infoBodyHeader'>Country: </span>" + obj.country + "</div></div>";
		}
	},
	$init() {
		this.$view.className += " likes";
	},
	setValue(value) {
		this.setValues(value);
	},
	getValue() {
		return this.getValues().value;
	}
}, webix.ui.template);