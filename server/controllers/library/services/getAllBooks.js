const Book = require("../../../schemas/library/books");
const AudioFile = require("../../../schemas/library/audiofile");

function getAllBooksService(start, count, headers) {
	let order = {};
	let total_count_filters = 10;										// books count for top list
	let re = headers.filter ? new RegExp(headers.filter, "i") : {};
	let searchOptions = [{}];
	if (headers.searchfield && re) {
		searchOptions = headers.searchfield === "author"
			? [ { "authorName": { $regex: re } }, {"authorSurname": { $regex: re }}, {"authorPatronymic": { $regex: re }} ]
			: [ {[headers.searchfield]: { $regex: re }} ];
	}
	let where = headers.searchfield && re ? searchOptions : [{}];

	switch(headers.filteringcolumn) {
		case "year":
			order = {year: "ASC"};
			break;
		case "pages":
			order = {pages: "DESC"};
			break;
		case "country":
			order = {year: "ASC"};
			where = [{ country: "Spain", year: {$gte: 1980, $lte: 2000} }];
			break;
	}

	return new Promise(async (resolve) => {
		let data = [];
		if (start) {
			if (headers.filteringcolumn === "files") {
				data = await AudioFile.find().populate({path: "bookId", populate: {path: "genres"}}).then((booksWithAudio) => {
					total_count_filters = booksWithAudio.length;
					return booksWithAudio.map(book => book.booksWithAudioToClient());
				});
			}
			else if (headers.filteringcolumn === "title") {
				data = await Book.aggregate([
					{
						$project: {
							"title": 1,
							"pages": 1,
							"year": 1,
							"authorName": 1,
							"authorSurname": 1,
							"authorPatronymic": 1,
							"publisher": 1,
							"country": 1,
							"availableCount": 1,
							"cover": 1,
							"genres": 1,
							"length": {$strLenCP: "$title"}
						}
					},
					{ $sort: {"length": -1} },
					{ $limit: total_count_filters }
				]).then(books => {
					return Book.populate(books, {path: "genres"}).then((populatedBooks) => {
						return populatedBooks.map(function (populatedBook) {
							populatedBook.genres = populatedBook.genres.map(genre => {
								genre = genre.toObject();
								genre.id = genre._id;
								delete genre._id;
								return genre;
							});
							populatedBook.id = populatedBook._id.toHexString();
							delete populatedBook._id;
							return populatedBook;
						});
					});
				});
			}
			else {
				data = await Book.find({$or: where}, null, {sort: order}).populate("genres").skip(+start).limit(+count).then(books => {
					return books.map(book => book.toClient());
				});
			}
		}
		Book.count({$or: where}).exec(function (err, total_count) {
			return resolve({"pos": +start, "data": data, "total_count": headers.filteringcolumn ? total_count < 10 ? total_count : total_count_filters : total_count});
		});
	});
}

module.exports = {
	getAllBooksService
};
