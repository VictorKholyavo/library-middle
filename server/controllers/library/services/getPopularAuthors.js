const Book = require("../../../schemas/library/books");

function getPopularAuthorsService() {
	return Book.aggregate([
		{
			$group: {
				_id: {authorName: "$authorName", authorSurname: "$authorSurname", authorPatronymic: "$authorPatronymic"},
				count: {$sum: 1}
			}
		},
		{$sort: {"count": -1}},
		{$limit: 10}
	]).then(authors => {
		return authors.map(function (author) {
			author.authorName = author._id.authorName;
			author.authorSurname = author._id.authorSurname;
			author.authorPatronymic = author._id.authorPatronymic;
			delete author._id;
			return author;
		});
	});
}

module.exports = {
	getPopularAuthorsService
};