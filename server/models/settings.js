module.exports = (sequelize, type) => {
	return sequelize.define("settings", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		setting: {
			type: type.STRING,
		},
		value: {
			type: type.BOOLEAN,
			defaultValue: true
		}
	});
};
