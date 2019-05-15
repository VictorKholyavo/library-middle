const {User, UserDetailes, Phones, Roles} = require("../../../../sequelize");

function getUsersToAdminService() {
	return User.findAll({include: [UserDetailes, Roles, Phones]}).then(usersToAdmin => {
		return usersToAdmin.map(user => {
			let role = user.role.dataValues;
			let phonesCount = user.phones.length;
			user = user.userdetaile.dataValues;
			user.role = role;
			user.phonesCount = phonesCount;
			return user;
		});
	});
}

module.exports = {
	getUsersToAdminService
};
