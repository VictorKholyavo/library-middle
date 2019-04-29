const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TextFile = new Schema ({
	bookId: {
		type: Schema.Types.ObjectId,
		ref: "Book"
	},
  path:  {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("TextFile", TextFile);
