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

module.exports = mongoose.model("AudioFile", AudioFile);
