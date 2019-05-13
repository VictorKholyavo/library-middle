const Book = require("../../schemas/library/books");
const BookLikes = require("../../schemas/library/bookLikes");
const BookRating = require("../../schemas/bookInfo/bookRating");

async function getBookInfo(bookId) {
	let bookLikes = await BookLikes.count({bookId: bookId});
	BookRating.update(
		{bookId: bookId},
		{$inc: {requestInfoCount: 1}}
	).then(incr => incr);
	return Book.findById(bookId).populate("genres").then(book => {
		book = book.toClient();
		book.likes = bookLikes;
		return book;
	});
}

module.exports = {
	getBookInfo
};
