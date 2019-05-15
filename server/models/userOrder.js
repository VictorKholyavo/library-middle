module.exports = (sequelize, type) => {
	return sequelize.define("userOrder", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		bookId: {
			type: type.STRING
		}
	});
};