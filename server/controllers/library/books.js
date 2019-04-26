const express = require("express");
let app = express();
const mongoose = require("mongoose");
const multer  = require("multer");
const Book = require("../../schemas/library/books");
const Genre = require("../../schemas/library/genre");

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
		const books = await Book.find().populate("genres").exec();
		res.send(books.map(book => book.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post("/add", upload.single("upload"), async (req, res) => {
	try {
		let path = req.file.destination + "/" + req.file.filename;
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
			cover: path
		});
		newBook.save(function(err, book) {
			if (err) {
				return res.status(401).send("Can't add new book")
			}
			for (let key in req.body) {
				if (key.indexOf("genre_") === 0) {
					Genre.findById(req.body[key]).then((genre) => {
						genre.books.push(book._id);
						genre.save();
					});
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
