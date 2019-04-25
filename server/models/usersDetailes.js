const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("userdetailes", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		firstname: {
			type: type.STRING
		},
		surname: {
			type: type.STRING
		},
		patronymic: {
			type: type.STRING
		},
		passport: {
			type: type.STRING
		},
		dateofbirth: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.NOW
		},
		address: {
			type: type.STRING
		},
		// phones: {
		// 	type: type.INTEGER
		// },
		cardnumber: {
			type: type.INTEGER
		},
		// user_id: {
		// 	type: type.INTEGER
		// }
	});
};
