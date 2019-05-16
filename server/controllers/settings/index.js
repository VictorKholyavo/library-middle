const {Settings} = require("../../../sequelize");

function getSettingAutoregistration() {
	return Settings.findOne({where: {setting: "autoregistration"}}).then(setting => {

	});
}

module.exports = {

}