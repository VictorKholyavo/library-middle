const {User, UserDetailes} = require("../../../../sequelize");
const Comments = require("../../../schemas/bookInfo/comments");

function getUsersInfoForComments() {
	// return new Promise((resolve, reject) => {
	return User.findAll({include: [UserDetailes]}).then(users => {
		return users.map(user => {
			let fullname = user.userdetaile.dataValues.firstname;
			user = user.userdetaile.dataValues;
			user.value = fullname;
			return user;
		});
	});
}

function getComments(bookId) {
	return Comments.find({bookId: bookId}).then(comments => {
		return comments.map(comment => comment.toClient());
	});
}

function addComment(user, commentInfo) {
	let newComment = new Comments({
		bookId: commentInfo.bookId,
		userId: user.id,
		text: commentInfo.text,
		date: commentInfo.date
	});
	return newComment.save((err, comment) => comment.toClient());
}

module.exports = {
	getUsersInfoForComments,
	getComments,
	addComment
};
