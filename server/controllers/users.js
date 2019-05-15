const express = require("express");
const app = express();
const {User, UserDetailes, Phones, Roles} = require("../../sequelize");
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const passport = require("passport");
const bcrypt = require("bcrypt");

passport.use(new JWTStrategy({
		jwtFromRequest: ExtractJWT.fromExtractors([ExtractJWT.fromAuthHeaderAsBearerToken(), ExtractJWT.fromUrlQueryParameter("Bearer")]),
		secretOrKey: "secret for library"
	},
	function (jwtPayload, cb) {
		return User.findOne({
			where: {id: jwtPayload.id}
		}).then(user => {
			return cb(null, user.dataValues);
		}).catch(err => {
			return cb(err);
		});
	}
));

passport.use(new LocalStrategy({usernameField: "email"},
	function (username, password, done) {
		User.findOne({
			where: {email: username}
		}).then(user => {
			if (!user) {
				return done(null, false);
			}
			if (!bcrypt.compareSync(password, user.password)) {
				return done(null, false);
			}
			return done(null, user.dataValues);
		});
	}
));

// ADMIN //
// app.get("/", async (req, res) => {
// 	const usersToAdmin = await User.findAll({include: [UserDetailes, Roles, Phones]});
// 	return res.json(usersToAdmin.map((user) => {
// 		let role = user.role.dataValues;
// 		let phonesCount = user.phones.length;
// 		user = user.userdetaile.dataValues;
// 		user.role = role;
// 		user.phonesCount = phonesCount;
// 		return user;
// 	}));
// });

app.put("/:id", async (req, res) => {
	let updateUserDetailes = {
		firstname: req.body.firstname,
		surname: req.body.surname,
		patronymic: req.body.patronymic,
		passport: req.body.passport,
		dateofbirth: req.body.dateofbirth,
		address: req.body.address,
		phones: req.body.phones,
		cardnumber: req.body.cardnumber
	};
	let optionsUserDetailes = {
		where: {id: req.body.id}
	};
	let updateUserRole = {
		roleUuid: req.body.role
	};
	let optionsUserRole = {
		where: {id: req.body.userId}
	};
	UserDetailes.update(updateUserDetailes, optionsUserDetailes)
		.then(function (rowsUpdate) {
			return;
		});
	User.update(updateUserRole, optionsUserRole)
		.then(function () {
			User.findOne({where: {id: req.body.userId}, include: [UserDetailes, Roles]}).then(user => {
				user.reload().then((user) => {
					let role = user.role.dataValues;
					user = user.userdetaile.dataValues;
					user.role = role;
					return res.json(user);
				})
			})
		});
});

// USERS //

// app.get("/user/:id", passport.authenticate("jwt", {session: false}), async (req, res, next) => {
// 	const userInfo = await User.findOne({where: {id: req.user.id}, include: [UserDetailes, Phones]});
// 	let counter = 1;
//
// 	userInfo.userdetaile.dataValues.phones = [];
// 	let userPhones = userInfo.phones.map(phone => {
// 		phone = phone.dataValues;
// 		userInfo.userdetaile.dataValues.phones.push(phone);
// 		counter++;
// 		return phone
// 	});
// 	return res.json(userInfo.userdetaile.dataValues);
// });

// LIBRARIAN //

app.get("/readers", async (req, res) => {
	const readersToLibrarian = await User.findAll({where: {roleUuid: 1}, include: [UserDetailes]});
	return res.json(readersToLibrarian.map((user) => {
		user = user.userdetaile.dataValues;
		return user;
	}));
});

module.exports = app;
