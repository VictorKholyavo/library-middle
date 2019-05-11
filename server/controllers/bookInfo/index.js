const Book = require("../../schemas/library/books");
const BookLikes = require("../../schemas/library/bookLikes");

async function getBookInfo(bookId) {
	let bookLikes = await BookLikes.count({bookId: bookId});
	return Book.findById(bookId).populate("genres").then(book => {
		book = book.toClient();
		book.likes = bookLikes;
		return book;
	});
}

module.exports = {
	getBookInfo
};
