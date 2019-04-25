const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("statuses", {
		id: {
			type: Sequelize.UUID,
			primaryKey: true
		},
		status: {
			type: type.STRING,
		}
	});
};
