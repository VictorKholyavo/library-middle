const passport = require("passport");
const jwt = require("jsonwebtoken");

const {User, UserDetailes} = require("../../sequelize");

require("../helpers/passport-strategies");

function signin(req, res, next) {
	return new Promise((resolve, reject) => {
		passport.authenticate("local", {session: false},
			function (err, user) {
				if (err) {
					return reject(err);
				}
				if (!user) {
					return reject("Укажите правильный email или пароль!");
				}
				req.logIn(user, {session: false}, function (err) {
					if (err) {
						return reject(err);
					}
					const token = jwt.sign({id: user.id}, "secret for library");
					return resolve({token: token});
				});
			})(req, res, next);
	});
}

function signup(req, res, next) {
	return new Promise((resolve, reject) => {
		let newUser = req.body;
		newUser.roleUuid = 1;
		User.create(newUser)
			.then(newUser => {
				let userDetailes = {userId: newUser.dataValues.id};
				UserDetailes.create(userDetailes).then(() => {
					const token = jwt.sign({id: newUser.dataValues.id}, "secret for library");
					return resolve({token});
				});
			});
	});
}

function status(req, res, next) {
	return new Promise((resolve, reject) => {
		User.findOne({where: {id: req.user.id}, include: [UserDetailes]}).then(userDetailes => {
			let token = jwt.sign({id: req.user.id}, "secret for library");
			return resolve({
				token: token,
				role: req.user.roleUuid,
				username: userDetailes.userdetaile.firstname,
				user_id: req.user.id
			});
		});
	});
}

function signout(req, res, next) {
	return new Promise((resolve, reject) => {
		req.logout();
		resolve({});
	});
}

module.exports = {
	signin,
	signup,
	status,
	signout
};