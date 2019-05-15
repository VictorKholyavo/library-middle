const {getUserInfoService} = require("./services/getUserInfo");
const {editUserInfoService} = require("./services/editUserInfo");
const {getUsersToAdminService} = require("./services/getUsersToAdmin");
const {editUsersInfoByAdminService} = require("./services/editUsersInfoByAdmin");

function getUserInfo(userId) {
	const userInfo = getUserInfoService(userId);
	return (userInfo);
}

function editUserInfo(userId, newUserInfo) {
	const userInfo = editUserInfoService(userId, newUserInfo);
	return (userInfo);
}

function getUsersToAdmin() {
	const usersToAdmin = getUsersToAdminService();
	return (usersToAdmin);
}

function editUserInfoByAdmin(userId, newUserInfo) {
	const userInfo = editUsersInfoByAdminService(userId, newUserInfo);
	return (userInfo);
}

module.exports = {
	getUserInfo,
	editUserInfo,
	getUsersToAdmin,
	editUserInfoByAdmin
};