const Genre = require("../../../schemas/library/genre");

function getGenresService() {
	return Genre.find().then(genres => genres.map(genre => genre.toClient()));
}

module.exports = {
	getGenresService
};