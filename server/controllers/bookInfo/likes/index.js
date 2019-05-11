const BookLikes = require("../../../schemas/library/bookLikes");

function addLike(user, bookId) {
	return new Promise(resolve => {
		return BookLikes.findOne({bookId: bookId, userId: user.id}).then(userLike => {
			let newLike = new BookLikes({
				bookId: bookId,
				userId: user.id
			});
			if (!userLike)
				return newLike.save();
			else
				return userLike.remove();
		}).then(() => BookLikes.count({bookId: bookId}).exec((error, likes) => resolve({likes: likes})));
	});
}

module.exports = {
	addLike
};
