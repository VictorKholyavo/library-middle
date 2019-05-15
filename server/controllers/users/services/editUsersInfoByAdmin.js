const {User, UserDetailes, Roles} = require("../../../../sequelize");

async function editUsersInfoByAdminService(userId, newUserInfo) {
	let updateUserDetailes = {
		firstname: newUserInfo.firstname,
		surname: newUserInfo.surname,
		patronymic: newUserInfo.patronymic,
		passport: newUserInfo.passport,
		dateofbirth: newUserInfo.dateofbirth,
		address: newUserInfo.address,
		cardnumber: newUserInfo.cardnumber
	};
	let optionsUserId = {
		where: {id: userId}
	};
	let updateUserRole = {
		roleUuid: newUserInfo.role
	};

	await UserDetailes.update(updateUserDetailes, optionsUserId)
		.then(updateUserDetailes => updateUserDetailes);
	await User.update(updateUserRole, optionsUserId)
		.then(updateUserRole => updateUserRole);
	return await User.findOne({where: {id: userId}, include: [UserDetailes, Roles]}).then(user => {
		let role = user.role.dataValues;
		user = user.userdetaile.dataValues;
		user.role = role;
		return user;
	});

}

module.exports = {
	editUsersInfoByAdminService
};