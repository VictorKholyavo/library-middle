const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileSystem = require("fs");
const controllers = require("../controllers");

const {
	users,
	books,
	comments,
	likes,
	bookinfo,
	orders,
	email,
	audiofile
} = controllers;

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/uploads");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

const upload = multer({storage: storage});

const controllerHandler = (promise, params) => async (req, res, next) => {
	const boundParams = params ? params(req, res, next) : [];
	try {
		const result = await promise(...boundParams);
		if (result && result.pos && result.total_count) {
			return res.json({"pos": result.pos, "data": result.data, "total_count": result.total_count});
		}
		else if (result && result.audioPath) {
			res.writeHead(200, {
				"Content-Type": "audio/mpeg",
				"Content-Length": result.stat
			});
			const readStream = fileSystem.createReadStream(result.audioPath);
			return readStream.pipe(res);
		}
		return res.json(result || {message: "OK"});
	} catch (error) {
		return res.status(500) && next(error);
	}
};
const c = controllerHandler;

// USERS (READERS, LIBRARIAN & ADMIN FUNCTIONALITY //
router.get("/userinfo", c(users.getUserInfo, req => [req.user.id]));										// get user info to user
router.put("/userinfo/:id", c(users.editUserInfo, req => [req.params.id, req.body]));		// edit user info by user
router.get("/usersinfotoadmin", c(users.getUsersToAdmin, req => [req]));								// get user info to user
router.put("/usersinfotoadmin/:id", c(users.editUserInfoByAdmin, req => [req.params.id, req.body]));		// edit user info by admin


// LIBRARY //
router.get("/books", c(books.getAllBooks, req => [req.query.start, req.query.count, req.headers]));
router.get("/books/popularauthors", c(books.getPopularAuthors, req => [req]));
router.post("/books", upload.single("upload"), c(books.addBook, req => [req.file, req.body]));
router.put("/books/:id", c(books.editBook, req => [req.body]));
router.post("/books/uploadfiles", upload.fields([{name: "text", maxCount: 3}, {
	name: "audio",
	maxCount: 3
}]), c(books.uploadFiles, req => [req.files, req.body.id]));
router.get("/books/genres", c(books.getGenres, req => [req]));

// BOOK FULL INFO (LIKES & COMMENTS) //
router.get("/bookinfo/:id", c(bookinfo.getBookInfo, req => [req.params.id]));

router.get("/comments/users", c(comments.getUsersInfoForComments, req => [req]));
router.get("/comments/:id", c(comments.getComments, req => [req.params.id]));
router.post("/comments", c(comments.addComment, req => [req.user, req.body]));

router.post("/like", c(likes.addLike, req => [req.user, req.body.bookId]));

router.get("/bookinfo/audio/:id", c(audiofile.getAudioFile, req => [req.params.id, req]));

// ORDERS (USER & LIBRARIAN) //
router.get("/orders/all", c(orders.getAllOrders, req => [req]));
router.put("/orders/all/:id", c(orders.editOrder, req => [req.params.id, req.body]));
router.delete("/orders/all/:id", c(orders.deleteOrder, req => [req.params.id]));

router.get("/orders", c(orders.getUserOrders, req => [req.user.id]));
router.post("/orders/:id", c(orders.addUserOrder, req => [req.user.id, req.params.id]));
router.put("/orders/:id", c(orders.editOrderByUser, req => [req.params.id, req.body]));

router.post("/mailing", c(email.main, req => [req.user, req.body]));

module.exports = router;