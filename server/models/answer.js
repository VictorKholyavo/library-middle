const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("answers", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		date: {
			type: type.DATEONLY
		},
		text: {
			type: type.STRING
		},
	});
};
