const Book = require("../../../schemas/library/books");
const BookRating = require("../../../schemas/bookInfo/bookRating");
const moveFile = require("move-file");

function addBookService(file, bookInfo) {
	let path = file.destination + "/" + file.filename;
	let newPath = file.destination + "/covers/" + file.filename;
	moveFile(path, newPath);

	let newBook = new Book ({
		title: bookInfo.title,
		pages: bookInfo.pages,
		year: bookInfo.year,
		authorName: bookInfo.authorName,
		authorSurname: bookInfo.authorSurname,
		authorPatronymic: bookInfo.authorPatronymic,
		publisher: bookInfo.publisher,
		country: bookInfo.country,
		availableCount: bookInfo.availableCount,
		cover: newPath
	});
	newBook.save((err, book) => {
		for (let key in bookInfo) {
			if (key.indexOf("genre_") === 0) {
				book.genres.push(bookInfo[key]);
			}
		}
		let newBookRating = new BookRating ({
			bookId: book._id
		});
		newBookRating.save();
		return book.save();
	});
}

module.exports = {
	addBookService
};