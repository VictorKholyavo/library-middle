const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("roles", {
		uuid: {
			type: Sequelize.UUID,
			primaryKey: true
		},
		role: {
			type: type.STRING,
		}
	});
};
