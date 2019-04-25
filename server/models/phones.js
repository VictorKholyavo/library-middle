const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("phones", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		phone: {
			type: type.STRING
		},
	});
};
