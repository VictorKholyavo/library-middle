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
		let sortCustomFunction = {};
		const where = req.headers.filter ? { title: { $regex: req.headers.filter, $options: "i"} } : {};

		switch(req.headers.filteringcolumn) {
			case "year":
				order = {year: "ASC"};
				break;
			case "pages":
				order = {pages: "DESC"};
				break;
			case "title":
				sortCustomFunction = function(a, b) {
					let  = a.title.replace(/\s+/g, "");
					let b = b.title.replace(/\s+/g, "");
					return b.length - a.length;
				};
				break;
			case "country":
				order = ["year", "ASC"];
				where = {country: "Spain", year: {[Op.between]: [1980, 2000]}};
				break;
		}

		let data = [];
		if (req.query.start && req.query.count) {
			data = await Book.find(where, null, {sort: order}).sort(sortCustomFunction).populate("genres").skip(start).limit(count).exec();
		}
		Book.count(where).exec(function (err, total_count) {
			return res.json({"pos": start, "data": data.map(doc => doc.toClient()), "total_count": req.headers.filteringcolumn ? 10 : total_count});
		});
	} catch (error) {
		res.status(500).send("Something broke");
	}
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
