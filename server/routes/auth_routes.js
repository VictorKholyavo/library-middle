const passport = require("passport");
const express = require("express");
const router = express.Router();
const auth = require("../controllers").auth;

require("../helpers/passport-strategies");

const controllerHandler = (promise, params) => async (req, res, next) => {
	const boundParams = params ? params(req, res, next) : [];
	try {
		const result = await promise(...boundParams);
		return res.json(result || {message: "OK"});
	}
	catch (error) {
		return res.status(401) && next(error);
	}
};

const c = controllerHandler;

// AUTHENTICATION //
router.post("/signin", c(auth.signin, (req, res, next) => [req, res, next]));
router.post("/signup", c(auth.signup, (req, res, next) => [req, res, next]));
router.post("/status", passport.authenticate("jwt", {session: false}), c(auth.status, (req, res, next) => [req, res, next]));
router.post("/signout", c(auth.signout, (req, res, next) => [req, res, next]));

module.exports = router;