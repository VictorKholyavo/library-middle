const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Book = require('../../schemas/library/books');

const GenreSchema = new Schema({
	name: {
		type: String,
    required: true
	}
});

GenreSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  obj.id = obj._id.toHexString();

  delete obj._id;
  return obj;
}

const Genre = mongoose.model("Genre", GenreSchema);

module.exports = Genre
