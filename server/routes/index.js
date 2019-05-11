const express = require("express");
const router = express.Router();
const multer  = require("multer");
const controllers = require("../controllers");

const {
	books,
	comments,
	likes,
	bookinfo,
	orders
} = controllers;

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/uploads");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage: storage });

const controllerHandler = (promise, params) => async (req, res, next) => {
	const boundParams = params ? params(req, res, next) : [];
	try {
		const result = await promise(...boundParams);
		if (result && result.pos && result.total_count) {
			return res.json({"pos": result.pos, "data": result.data, "total_count": result.total_count});
		}
		return res.json(result || {message: "OK"});
	} catch (error) {
		return res.status(500) && next(error);
	}
};
const c = controllerHandler;

// LIBRARY //
router.get("/books", c(books.getAllBooks, req => [req.query.start, req.query.count, req.headers]));
router.get("/books/popularauthors", c(books.getPopularAuthors, req => [req]));
router.post("/books", upload.single("upload"), c(books.addBook, req => [req.file, req.body]));
router.put("/books/:id", c(books.editBook, req => [req.body]));
router.post("/books/uploadfiles", upload.fields([{name: "text", maxCount: 3}, {name: "audio", maxCount: 3}]), c(books.uploadFiles, req => [req.files, req.body.id]));
router.get("/books/genres", c(books.getGenres, req => [req]));

// BOOK FULL INFO (LIKES & COMMENTS) //
router.get("/bookinfo/:id", c(bookinfo.getBookInfo, req => [req.params.id]));
router.get("/comments/:id", c(comments.getComments, req => [req.params.id]));
router.post("/comments", c(comments.addComment, req => [req.user, req.body]));
router.post("/like", c(likes.addLike, req => [req.user, req.body.bookId]));

// ORDERS (USER & LIBRARIAN) //
router.get("/orders/:id", c(orders.getUserOrders, req => [req.user]));

module.exports = router;