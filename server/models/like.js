const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("likes", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		}
	});
};
