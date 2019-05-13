const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookRatingSchema = new Schema({
	bookId: {
		type: Schema.Types.ObjectId,
		ref: "Book"
	},
	requestInfoCount: {
		type: Number,
		default: 0
	},
	ordersCount: {
		type: Number,
		default: 0
	}
});

BookRatingSchema.methods.toClient = function toClient() {
	const obj = this.toObject();
	obj.id = obj._id.toHexString();

	delete obj._id;
	return obj;
};

const BookRating = mongoose.model("BookRating", BookRatingSchema);

module.exports = BookRating;
