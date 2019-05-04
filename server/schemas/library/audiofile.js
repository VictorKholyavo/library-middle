const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AudioFile = new Schema ({
	bookId: {
		type: Schema.Types.ObjectId,
		ref: "Book"
	},
  path:  {
		type: String,
		required: true
	}
});

AudioFile.methods.booksWithAudioToClient = function booksWithAudioToClient() {
  const obj = this.toObject();
  obj.id = obj.bookId._id.toHexString();
	obj.title = obj.bookId.title;
	obj.pages = obj.bookId.pages;
	obj.year = obj.bookId.year;
	obj.authorName = obj.bookId.authorName;
	obj.authorSurname = obj.bookId.authorSurname;
	obj.authorPatronymic = obj.bookId.authorPatronymic;
	obj.publisher = obj.bookId.publisher;
	obj.country = obj.bookId.country;
	obj.availableCount = obj.bookId.availableCount;
	obj.cover = obj.bookId.cover;
	obj.genres = obj.bookId.genres;
	obj.genres.map(function (genre) {
		genre.id = genre._id;
		delete genre._id;
		return genre;
	});
	delete obj.bookId;
	delete obj._id;
  return obj;
}

module.exports = mongoose.model("AudioFile", AudioFile);
