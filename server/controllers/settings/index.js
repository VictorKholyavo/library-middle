const {Settings} = require("../../../sequelize");

function getSettingAutoregistration() {
	return Settings.findOne({where: {setting: "autoregistration"}}).then(setting => {
		console.log(setting);
	});
}

module.exports = {
	getSettingAutoregistration
};