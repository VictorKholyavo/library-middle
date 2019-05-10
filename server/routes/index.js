const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

const {
	comments
} = controllers;

const controllerHandler = (promise, params) => async (req, res, next) => {
	const boundParams = params ? params(req, res, next) : [];
	try {
		const result = await promise(...boundParams);
		return res.json(result || {message: "OK"});
	} catch (error) {
		return res.status(500) && next(error);
	}
};
const c = controllerHandler;

router.get("/comments", c(comments.getComments, req => [req.params.name]));

module.exports = router;