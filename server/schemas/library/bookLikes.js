const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookLikes = new Schema ({
	bookId: {
		type: Schema.Types.ObjectId,
		ref: "Book"
	},
	userId: {
		type: Number
	}
});

BookLikes.statics.countLikes = function countLikes(userId, bookId, callback) {
	BookLikes.find(
		{ userId: userId, bookId: bookId },
		function (err, doc) {
			if (err) {
				let error = "No groups found";
				return callback(error);
			}
			else {
				return callback(null, doc);
			}
		}
	);
};

module.exports = mongoose.model("BookLikes", BookLikes);
