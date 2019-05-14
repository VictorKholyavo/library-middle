const books = require("./library");
const comments = require("./bookInfo/comments");
const likes = require("./bookInfo/likes");
const bookinfo = require("./bookInfo");
const orders = require("./orders");
const email = require("./email/mailing");
const audiofile = require("./bookInfo/files/audiofiles");

module.exports = {
	books,
	comments,
	likes,
	bookinfo,
	orders,
	email,
	audiofile
};