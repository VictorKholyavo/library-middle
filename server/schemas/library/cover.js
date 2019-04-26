const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cover = new Schema ({
  path:  {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("Cover", Cover);
