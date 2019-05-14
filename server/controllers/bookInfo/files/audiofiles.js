const fileSystem = require("fs");
const AudioFiles = require("../../../schemas/library/audiofile");

async function getAudioFile(bookId) {
	let sendData = {};
	const audioFile = await AudioFiles.findOne({bookId: bookId}).then(audioInfo => {
		if (audioInfo) {
			let stat = fileSystem.statSync(audioInfo.path);
			sendData.audioPath = audioInfo.path;
			sendData.stat = stat.size;
		}
		return sendData;
	});
	return audioFile;
}

module.exports = {
	getAudioFile
};
