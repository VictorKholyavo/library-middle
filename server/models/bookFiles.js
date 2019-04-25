const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("bookFiles", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		fileType: {
			type: type.STRING
		},
		path: {
			type: type.STRING
		},
		size: {
			type: type.STRING
		}
	});
};
