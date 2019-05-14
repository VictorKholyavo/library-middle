webix.protoUI({
	name: "covertemplate",
	defaults: {
		width: 250,
		height: 250,
		borderless: true,
		template: "<img class='photo' src='#value#'>",
	},
	$init() {
		this.$view.className += " bookcover";
	},
	setValue(value) {
		this.setValues({ value: value });
	},
	getValue() {
		return this.getValues().value;
	}
}, webix.ui.template);
