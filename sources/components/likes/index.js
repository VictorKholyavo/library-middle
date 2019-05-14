webix.protoUI({
	name: "likes",
	defaults: {
		width: 250,
		height: 250,
		borderless: true,
		template:(obj) => {
			return "<div class='columnSettings'><div class='rowSettings'><span class='infoBodyHeader'>Likes: "+obj.value+"</span></div></div>";
		}
	},
	$init() {
		this.$view.className += " likes";
	},
	setValue(value) {
		this.setValues({ value: value });
	},
	getValue() {
		return this.getValues().value;
	}
}, webix.ui.template);