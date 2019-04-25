const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("books", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		title: {
			type: type.STRING
		},
		pages: {
			type: type.INTEGER
		},
		year: {
			type: type.INTEGER
		},
		authorName: {
			type: type.STRING
		},
		authorSurname: {
			type: type.STRING
		},
		authorPatronymic: {
			type: type.STRING
		},
		publisher: {
			type: type.STRING
		},
		country: {
			type: type.STRING
		},
		availableCount: {
			type: type.INTEGER
		}
	});
};
