webix.protoUI({
	name: "audio",
	defaults: {
		width: 250,
		borderless: true,
		template:(obj) => {
			return "<audio controls><source src='" + obj + "'></audio>";
		}
	},
	$init() {
		this.$view.className += " audio";
	},
	setValue(value) {
		this.setValues(value);
	},
	getValue() {
		return this.getValues().value;
	}
}, webix.ui.template);