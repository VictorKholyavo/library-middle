const books = require("./library");
const comments = require("./bookInfo/comments");
const likes = require("./bookInfo/likes");
const bookinfo = require("./bookInfo");
const orders = require("./orders");

module.exports = {
	books,
	comments,
	likes,
	bookinfo,
	orders
};