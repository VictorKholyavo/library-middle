const express = require("express");
let app = express();
const url = require('url');
const mongoose = require("mongoose");
const multer  = require("multer");
const moveFile = require("move-file");
const Book = require("../../schemas/library/books");
const Genre = require("../../schemas/library/genre");
const TextFile = require("../../schemas/library/textfile");
const AudioFile = require("../../schemas/library/audiofile");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/uploads");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage: storage });

app.get("/", async (req, res) => {
	try {
		let start = +req.query.start;
		let count = +req.query.count;
		let order = {};
		let total_count_filters = 10;
		let sortCustomFunction = {};
		let where = req.headers.filter ? { title: { $regex: req.headers.filter, $options: "i"} } : {};
		let data = [];

		switch(req.headers.filteringcolumn) {
			case "year":
				order = {year: "ASC"};
				break;
			case "pages":
				order = {pages: "DESC"};
				break;
			case "country":
				order = {year: "ASC"};
				where = { country: "Spain", year: {$gte: 1980, $lte: 2000} };
				break;
		}
		if (req.query.start && req.query.count) {
			if (req.headers.filteringcolumn === "files") {
				data = await AudioFile.find().populate({path: "bookId", populate: {path: "genres"}}).then((booksWithAudio) => {
					total_count_filters = booksWithAudio.length;
					return booksWithAudio.map(book => book.booksWithAudioToClient());
				});
			}
			else if (req.headers.filteringcolumn === "title") {
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
				]).then((books) => {
					Book.populate(books, {path: "genres"}).then((populatedBooks) => {
						console.log(populatedBooks.map(function (book) {
							book.id = book._id;
							return book
						}));
						// return populatedBooks.map(book => book.toClient());
					});
				});
			}
			else {
				data = await Book.find(where, null, {sort: order}).populate("genres").skip(start).limit(count).then((books) => {
					return books.map(book => book.toClient());
				});
			}
		}
		Book.count(where).exec(function (err, total_count) {
			return res.json({"pos": start, "data": data, "total_count": req.headers.filteringcolumn ? total_count_filters : total_count});
		});
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.get("/popularauthors", async (req, res) => {
	let authorsByBooksCount = await Book.aggregate([
		{
			$group: {
				_id: {authorName: "$authorName", authorSurname: "$authorSurname",  authorPatronymic: "$authorPatronymic"},
				count: {$sum: 1}
			}
		},
		{ $sort: {"count": -1} },
		{ $limit: 10 }
	]).then((authors) => {
		return res.json(authors.map(function (author) {
			author.authorName = author._id.authorName;
			author.authorSurname = author._id.authorSurname;
			author.authorPatronymic = author._id.authorPatronymic;
			delete author._id;
			return author;
		}));
	});
});

app.post("/uploadFiles", upload.fields([{name: "text", maxCount: 3}, {name: "audio", maxCount: 3}]), async (req, res) => {
  let text = await req.files.text;
  let audio = await req.files.audio;

	Book.findById(req.body.id).then(async (book) => {
		if (text) {
			text.map(function (textfile) {
				let oldPath = textfile.destination + "/" + textfile.filename;
				let newPath = textfile.destination + "/textfiles/" + textfile.filename;
				moveFile(oldPath, newPath);
				let newTextFile = new TextFile ({
					bookId: book._id,
					path: newPath
				});
				return newTextFile.save();
			});
		}
		if (audio) {
			audio.map(function (audiofile) {
				let oldPath = audiofile.destination + "/" + audiofile.filename;
				let newPath = audiofile.destination + "/audiofiles/" + audiofile.filename;
				moveFile(oldPath, newPath);
				let newAudioFile = new AudioFile ({
					bookId: book._id,
					path: newPath
				});
				return newAudioFile.save();
			});
		}
	});
});

app.post("/add", upload.single("upload"), async (req, res) => {
	try {
		let path = req.file.destination + "/" + req.file.filename;
		let newPath = req.file.destination + "/covers/" + req.file.filename;
		moveFile(path, newPath);

		let newBook = await new Book ({
			title: req.body.title,
			pages: req.body.pages,
			year: req.body.year,
			authorName: req.body.authorName,
			authorSurname: req.body.authorSurname,
			authorPatronymic: req.body.authorPatronymic,
			publisher: req.body.publisher,
			country: req.body.country,
			availableCount: req.body.availableCount,
			cover: newPath
		});
		newBook.save(function(err, book) {
			if (err) {
				return res.status(401).send("Can't add new book")
			}
			for (let key in req.body) {
				if (key.indexOf("genre_") === 0) {
					book.genres.push(req.body[key]);
				}
			}
			book.save();
			return res.json(book);
		});
	} catch (err) {
		res.status(500).send("Something broke");
	}
});

app.put("/:id", async (req, res) => {
	let genresIdOfUpdatedBooks = [];
	for (let key in req.body) {
		if (key.indexOf("genre_") === 0) {
			genresIdOfUpdatedBooks.push(req.body[key]);
		}
	}
	await Book.findOneAndUpdate(
		{ _id: req.body.id },
		{
			$set: {
				title: req.body.title,
		    pages: req.body.pages,
		    year: req.body.year,
				authorName: req.body.authorName,
				authorSurname: req.body.authorSurname,
		    authorPatronymic: req.body.authorPatronymic,
		    publisher: req.body.publisher,
		    country: req.body.country,
		    availableCount: req.body.availableCount,
				genres: []
			}
		},
		{ new: true },
		function (err, updatedBook) {
			Book.findById(updatedBook._id).then((book) => {
				genresIdOfUpdatedBooks.map(function(genreId) {
					book.genres.push(genreId);
				});
				book.save();
				book.populate("genres", function (err, doc) {
					return res.send(doc.toClient());
				});
			});
		}
	);
});

module.exports = app;
