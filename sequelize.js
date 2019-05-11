const Sequelize = require("sequelize");
const UserModel = require("./server/models/users");
const UserDetailesModel = require("./server/models/usersDetailes");
const RolesModel = require("./server/models/roles");
const PhonesModel = require("./server/models/phones");
const UserOrderModel = require("./server/models/userOrder");
const StatusModel = require("./server/models/status");

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
// Books.hasOne(UserOrder);
// UserOrder.belongsTo(Books);
UserOrder.belongsTo(Status);
UserOrder.belongsTo(User);

sequelize.sync()
	.then(() => {
		console.log("Database & tables created!")
	});

module.exports = {
	User,
	UserDetailes,
	Roles,
	Phones,
	UserOrder,
	Status
};
