const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric"
};

const CommentSchema = new Schema({
	bookId: {
		type: Schema.Types.ObjectId,
		ref: "Book"
	},
	userId: {
		type: Number,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	}
});

CommentSchema.methods.toClient = function toClient() {
	const obj = this.toObject();
	obj.id = obj._id.toHexString();
	obj.user_id = obj.userId;
	obj.date = obj.date.toLocaleString("ru", options);

	delete obj.userId;
	delete obj._id;
	return obj;
};

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
