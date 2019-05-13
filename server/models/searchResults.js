module.exports = (sequelize, type) => {
	return sequelize.define("searchResults", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		searchResult: {
			type: type.STRING
		}
	});
};