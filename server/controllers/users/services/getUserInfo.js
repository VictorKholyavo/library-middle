const {User, UserDetailes, Phones} = require("../../../../sequelize");

function getUserInfoService(userId) {
	return User.findOne({where: {id: userId}, include: [UserDetailes, Phones]}).then(async (userInfo) => {
		userInfo.userdetaile.dataValues.phones = [];
		userInfo.userdetaile.dataValues.phones = await userInfo.phones.map(phone => {
			phone = phone.dataValues;
			userInfo.userdetaile.dataValues.phones.push(phone);
			return phone;
		});
		return await userInfo.userdetaile;
	});
}

module.exports = {
	getUserInfoService
};
