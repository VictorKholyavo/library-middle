const Sequelize = require("sequelize");
const UserModel = require("./server/models/users");
const UserDetailesModel = require("./server/models/usersDetailes");
const RolesModel = require("./server/models/roles");
const PhonesModel = require("./server/models/phones");
const UserOrderModel = require("./server/models/userOrder");
const StatusModel = require("./server/models/status");
const SearchResultsModel = require("./server/models/searchResults");
const SettingsModel = require("./server/models/settings");

const sequelize = new Sequelize("library", "root", "", {
	host: "localhost",
	dialect: "mysql",
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	define: {
		timestamps: false
	}
});

// USERS, USER DETAILES AND ROLES OF USERS//
const User = UserModel(sequelize, Sequelize);
const UserDetailes = UserDetailesModel(sequelize, Sequelize);
const Roles = RolesModel(sequelize, Sequelize);
const Phones = PhonesModel(sequelize, Sequelize);
User.hasOne(UserDetailes);
User.belongsTo(Roles);
User.hasMany(Phones);

// USER ORDERS //
const UserOrder = UserOrderModel(sequelize, Sequelize);
const Status = StatusModel(sequelize, Sequelize);
User.hasMany(UserOrder);
UserOrder.belongsTo(Status);
UserOrder.belongsTo(User);

// SEARCH RESULTS //
const SearchResults = SearchResultsModel(sequelize, Sequelize);

// SETTINGS //
const Settings = SettingsModel(sequelize, Sequelize);

sequelize.sync()
	.then(() => {
		console.log("Database & tables created!");
	});

module.exports = {
	User,
	UserDetailes,
	Roles,
	Phones,
	UserOrder,
	Status,
	SearchResults,
	Settings
};
