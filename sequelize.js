const Sequelize = require("sequelize");
const UserModel = require("./server/models/users");
const UserDetailesModel = require("./server/models/usersDetailes");
const RolesModel = require("./server/models/roles");
const GenresModel = require("./server/models/genres");
const BooksModel = require("./server/models/books");
const PhonesModel = require("./server/models/phones");
const CoverModel = require("./server/models/cover");
const BookFilesModel = require("./server/models/bookFiles");
const BookAudioFilesModel = require("./server/models/bookAudioFiles");
const UserOrderModel = require("./server/models/userOrder");
const StatusModel = require("./server/models/status");
const CommentModel = require("./server/models/comment");
const LikeModel = require("./server/models/like");
// const AnswerModel = require("./server/models/answer");

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

//BOOKS, GENRES, COVERS OF BOOKS, TEXT AND AUDIO FILES//
const Books = BooksModel(sequelize, Sequelize);
const Genres = GenresModel(sequelize, Sequelize);
const Cover = CoverModel(sequelize, Sequelize);
const BookFiles = BookFilesModel(sequelize, Sequelize);
const BookAudioFiles = BookAudioFilesModel(sequelize, Sequelize);
Genres.belongsToMany(Books, {through: "GenresBooks"});
Books.belongsToMany(Genres, {through: "GenresBooks"});
Books.hasOne(Cover);
Cover.belongsTo(Books);
Books.hasMany(BookFiles);
Books.hasMany(BookAudioFiles);
BookFiles.belongsTo(Books);
BookAudioFiles.belongsTo(Books);

// USER ORDERS //
const UserOrder = UserOrderModel(sequelize, Sequelize);
const Status = StatusModel(sequelize, Sequelize);
User.hasMany(UserOrder);
Books.hasOne(UserOrder);
UserOrder.belongsTo(Books);
UserOrder.belongsTo(Status);
UserOrder.belongsTo(User);

// LIKES //
const Like = LikeModel(sequelize, Sequelize);
User.belongsToMany(Books, {through: "BooksLikes"});
Books.belongsToMany(User, {through: "BooksLikes"});

// COMMENTS //
const Comment = CommentModel(sequelize, Sequelize);
// const Answer = AnswerModel(sequelize, Sequelize);
User.hasMany(Comment, {foreignKey: 'user_id'});
Comment.belongsTo(User, {foreignKey: 'user_id'});
Books.hasMany(Comment);
// Comment.hasMany(Answer);

sequelize.sync()
	.then(() => {
		console.log("Database & tables created!")
	});

module.exports = {
	User,
	UserDetailes,
	Roles,
	Books,
	Genres,
	Phones,
	Cover,
	BookFiles,
	BookAudioFiles,
	UserOrder,
	Status,
	Comment,
	Like
};
