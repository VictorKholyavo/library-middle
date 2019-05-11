const Book = require("../../../schemas/library/books");

function editBookService(bookInfo) {
	let genresIdOfUpdatedBooks = [];
	for (let key in bookInfo) {
		if (key.indexOf("genre_") === 0) {
			genresIdOfUpdatedBooks.push(bookInfo[key]);
		}
	}
	return Book.findOneAndUpdate(
		{ _id: bookInfo.id },
		{
			$set: {
				title: bookInfo.title,
				pages: bookInfo.pages,
				year: bookInfo.year,
				authorName: bookInfo.authorName,
				authorSurname: bookInfo.authorSurname,
				authorPatronymic: bookInfo.authorPatronymic,
				publisher: bookInfo.publisher,
				country: bookInfo.country,
				availableCount: bookInfo.availableCount,
				genres: []
			}
		},
		{ new: true },
		function (err, updatedBook) {
			Book.findById(updatedBook._id).then(book => {
				genresIdOfUpdatedBooks.map(genreId => book.genres.push(genreId));
				book.save(function () {
					book.populate("genres", function (err, editedBook) {
						return editedBook.toClient();
					});
				});
			});
		}
	);
}

module.exports = {
	editBookService
};