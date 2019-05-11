const Book = require("../../../schemas/library/books");
const AudioFile = require("../../../schemas/library/audiofile");
const TextFile = require("../../../schemas/library/textfile");
const moveFile = require("move-file");

function uploadFilesService(files, bookId) {
	let text = files.text;
	let audio = files.audio;

	Book.findById(bookId).then(book => {
		if (text) {
			text.map(function (textfile) {
				let oldPath = textfile.destination + "/" + textfile.filename;
				let newPath = textfile.destination + "/textfiles/" + textfile.filename;
				moveFile(oldPath, newPath);
				let newTextFile = new TextFile({
					bookId: book._id,
					path: newPath
				});
				return newTextFile.save();
			});
		}
		if (audio) {
			audio.map(function (audiofile) {
				let oldPath = audiofile.destination + "/" + audiofile.filename;
				let newPath = audiofile.destination + "/audiofiles/" + audiofile.filename;
				moveFile(oldPath, newPath);
				let newAudioFile = new AudioFile({
					bookId: book._id,
					path: newPath
				});
				return newAudioFile.save();
			});
		}
	});
}

module.exports = {
	uploadFilesService
};