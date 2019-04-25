const express = require("express");
let app = express();
const mongoose = require("mongoose");
const Book = require("../schemas/library/books");

app.get("/", async (req, res) => {
	try {
		const books = await Book.find().exec();
		res.send(books.map(book => book.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.get("/add", async (req, res) => {
	try {
		let newBook = await new Book ({
			title: "req.body.title",
			pages: 123,
			year: 213,
			authorName: "req.body.authorName",
			authorSurname: "req.body.authorSurname",
			authorPatronymic: "req.body.authorPatronymic",
			publisher: "req.body.publisher",
			country: "req.body.country",
			availableCount: 3421,
			image: "req.body.image"
			// title: req.body.title,
			// pages: req.body.pages,
			// year: req.body.year,
			// authorName: req.body.authorName,
			// authorSurname: req.body.authorSurname,
			// authorPatronymic: req.body.authorPatronymic,
			// publisher: req.body.publisher,
			// country: req.body.country,
			// availableCount: req.body.availableCount,
			// image: req.body.image
		});
		newBook.save(function(err, docs) {
			if (err) {
				return res.status(401).send("Can't add new product")
			}
			return res.json(newBook)
		});
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

module.exports = app;
