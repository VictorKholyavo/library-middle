const express = require("express");
const app = express();
const Book = require("../../schemas/library/books");
const BookLikes = require("../../schemas/library/bookLikes");

app.get("/:id", async (req, res) => {
	try {
		let bookLikes = await BookLikes.count({bookId: req.params.id});
		let bookFullInfo = await Book.findById(req.params.id).populate("genres").then(book => {
			book = book.toClient();
			book.likes = bookLikes;
			return book;
		});
		return res.json(bookFullInfo);
	} catch (error) {
		console.log(error);
	}
});

app.post("/like", async (req, res) => {
	try {
		let newLike = await new BookLikes({
			bookId: req.body.bookId,
			userId: req.user.id
		});
		await BookLikes.findOne({bookId: req.body.bookId, userId: req.user.id}).then(userLike => {
			if (!userLike) {
				return newLike.save();
			} else {
				return userLike.remove();
			}
		});
		await BookLikes.count({bookId: req.body.bookId}).exec(function (error, likes) {
			return res.json(likes);
		});
	} catch (error) {
		console.log(error);
	}
});

module.exports = app;
