const Comments = require("../../../schemas/bookInfo/comments");

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
	getComments,
	addComment
};
