const {getAllBooksService} = require("./services/getAllBooks");
const {getPopularAuthorsService} = require("./services/getPopularAuthors");
const {addBookService} = require("./services/addBook");
const {editBookService} = require("./services/editBook");
const {uploadFilesService} = require("./services/uploadFiles");
const {getGenresService} = require("./services/getGenres");

function getAllBooks(start, count, headers) {
	const books = getAllBooksService(start, count, headers);
	return (books);
}

function getPopularAuthors() {
	const authors = getPopularAuthorsService();
	return (authors);
}

function addBook(file, bookInfo) {
	const addBook = addBookService(file, bookInfo);
	return (addBook);
}

function editBook(bookInfo) {
	const editBook = editBookService(bookInfo);
	return (editBook);
}

function uploadFiles(files, bookId) {
	const editBook = uploadFilesService(files, bookId);
	return (editBook);
}

function getGenres() {
	const genres = getGenresService();
	return (genres);
}

module.exports = {
	getAllBooks,
	getPopularAuthors,
	addBook,
	editBook,
	uploadFiles,
	getGenres
};
