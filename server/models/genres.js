const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("genres", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		genre: {
			type: type.STRING
		}
	});
};