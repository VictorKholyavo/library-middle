const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cover = new Schema ({
  path:  {
		type: String,
		required: true
	},
  caption: {
		type: String
	}
});

module.exports = mongoose.model("Photos", Cover);
