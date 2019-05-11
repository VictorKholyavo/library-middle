const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Genre = require("./genre");

const BookSchema = new Schema ({
	title: {
		type: String,
		required: true
	},
	pages: {
		type: Number,
		required: true
	},
	year: {
		type: Number,
		required: true
	},
	authorName: {
		type: String,
		required: true
	},
	authorSurname: {
		type: String,
		required: true
	},
	authorPatronymic: {
		type: String,
		required: true
	},
	publisher: {
		type: String,
		required: true
	},
	country: {
		type: String,
		required: true
	},
	genres: [{
		type: Schema.Types.ObjectId,
		ref: "Genre"
	}],
	availableCount: {
		type: Number,
		required: true
	},
	cover: {
		type: String
	}
});

BookSchema.methods.toClient = function toClient() {
	const obj = this.toObject();
	// // Rename fields:
	obj.genres.map(function (genre) {
		genre.id = genre._id;
		delete genre._id;
		return genre;
	});
	obj.id = obj._id.toHexString();
	delete obj._id;
	return obj;
};

// Компилируем модель из схемы
const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
