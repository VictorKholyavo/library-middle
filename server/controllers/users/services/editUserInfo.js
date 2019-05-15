const {User, UserDetailes, Phones} = require("../../../../sequelize");

async function editUserInfoService(userId, newUserInfo) {
	const userInfo = await User.findOne({where: {id: userId}, include: [UserDetailes, Phones]});

	let updateUserDetailes = {
		firstname: newUserInfo.firstname,
		surname: newUserInfo.surname,
		patronymic: newUserInfo.patronymic,
		passport: newUserInfo.passport,
		dateofbirth: newUserInfo.dateofbirth,
		address: newUserInfo.address,
		cardnumber: newUserInfo.cardnumber,
	};
	let options = {
		where: {id: userId}
	};

	let newPhonesFromUser = [];
	newPhonesFromUser.push(newUserInfo.phone1 || null, newUserInfo.phone2 || null, newUserInfo.phone3 || null, newUserInfo.phone4 || null);

	newPhonesFromUser.map((phone, index) => {
		userInfo.getPhones().then(phonesFromDB => {
			if (phonesFromDB[index] && index < 4) {
				Phones.update({phone: newUserInfo["phone" + (index + 1)]}, {where: {id: phonesFromDB[index].dataValues.id}});
			} else if (phone !== null && index < 4) {
				Phones.create({phone: newUserInfo["phone" + (index + 1)], userId: userId});
			}
		});
	});

	return UserDetailes.update(updateUserDetailes, options)
		.then(updatedUserDetailes => updatedUserDetailes[0]);
}

module.exports = {
	editUserInfoService
};
