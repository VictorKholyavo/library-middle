export function state(app) {
	const service = {
		getState() {
			return this.state;
		},
		setState(state) {
			console.log(state);
			this.state = state;
		},
		state: 0
	};
	app.setService("state", service);
}