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

app.post("/login", (req, res, next) => {
	passport.authenticate("local", {session: false},
		function (err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(403).send("Укажите правильный email или пароль!");
			}
			req.logIn(user, {session: false}, function (err) {
				if (err) {
					return next(err);
				}
				const token = jwt.sign({id: user.id}, "secret for library");
				return res.json({token: token});
			});
		})(req, res, next);
});

app.post("/login/status", passport.authenticate("jwt", {session: false}), async (req, res, next) => {
	if (req.user) {
		const userDetailes = await User.findOne({where: {id: req.user.id}, include: [UserDetailes]});
		let token = jwt.sign({id: req.user.id}, "secret for library");
		return res.json({
			token: token,
			role: req.user.roleUuid,
			username: userDetailes.userdetaile.firstname,
			user_id: req.user.id
		});
	}
	return res.json(null);
});

app.get("/getInfo", passport.authenticate("jwt", {session: false}), async (req, res, next) => {
	const userDetailes = await User.findOne({where: {id: req.user.id}, include: [UserDetailes]});
	return res.json(userDetailes.usersdetaile.dataValues);
});

app.post("/logout", (req, res) => {
	req.logout();
	res.json({});
});

// ADMIN //
app.get("/", async (req, res) => {
	const usersToAdmin = await User.findAll({include: [UserDetailes, Roles, Phones]});
	return res.json(usersToAdmin.map((user) => {
		let role = user.role.dataValues;
		let phonesCount = user.phones.length;
		user = user.userdetaile.dataValues;
		user.role = role;
		user.phonesCount = phonesCount;
		return user;
	}));
});
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
	}
	let optionsUserDetailes = {
		where: {id: req.body.id}
	}
	let updateUserRole = {
		roleUuid: req.body.role
	}
	let optionsUserRole = {
		where: {id: req.body.userId}
	}
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
					console.log(user);

					return res.json(user);
				})
			})
		});
});

// USERS //

app.get("/user/:id", passport.authenticate("jwt", {session: false}), async (req, res, next) => {
	const userInfo = await User.findOne({where: {id: req.user.id}, include: [UserDetailes, Phones]});
	let counter = 1;

	userInfo.userdetaile.dataValues.phones = [];
	let userPhones = userInfo.phones.map(function (phone) {
		phone = phone.dataValues;
		userInfo.userdetaile.dataValues.phones.push(phone);
		counter++;
		return phone
	});
	return res.json(userInfo.userdetaile.dataValues);
});

app.put("/user/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
	const userInfo = await User.findOne({where: {id: req.user.id}, include: [UserDetailes, Phones]});

	let updateUserDetailes = {
		firstname: req.body.firstname,
		surname: req.body.surname,
		patronymic: req.body.patronymic,
		passport: req.body.passport,
		dateofbirth: req.body.dateofbirth,
		address: req.body.address,
		cardnumber: req.body.cardnumber,
	}
	let options = {
		where: {id: req.body.id}
	}
	let phonesFromRequest = [];
	phonesFromRequest.push(req.body.phone1 || null, req.body.phone2 || null, req.body.phone3 || null, req.body.phone4 || null);


	phonesFromRequest.map(function (phone, index, array) {
		userInfo.getPhones().then(function (phonesFromDB) {
			if (phonesFromDB[index] && index < 4) {
				Phones.update({phone: req.body["phone" + (index + 1)]}, {where: {id: phonesFromDB[index].dataValues.id}});
			} else if (phone !== null && index < 4) {
				Phones.create({phone: req.body["phone" + (index + 1)], userId: req.body.userId});
			}
		});
	});

	UserDetailes.update(updateUserDetailes, options)
		.then(function (updatedUserDetailes) {
			return res.json(updatedUserDetailes[0])
		});
});

app.post("/registration", async (req, res) => {
	try {
		let newUser = req.body;
		newUser.roleUuid = 1;
		console.log(newUser);
		User.create(newUser)
			.then((newUser) => {
				console.log(newUser.dataValues.id)
				let userDetailes = {userId: newUser.dataValues.id}
				UserDetailes.create(userDetailes).then((newUser) => {
					res.send("You have been registered");
				});
			});
	} catch (error) {

	}
});

app.get("/comments", async (req, res) => {
	const usersForComments = await User.findAll({include: [UserDetailes]});
	return res.json(usersForComments.map(user => {
		let fullname = user.userdetaile.dataValues.firstname;
		user = user.userdetaile.dataValues;
		user.value = fullname;
		return user;
	}));
});
// LIBRARIAN //

app.get("/readers", async (req, res) => {
	const readersToLibrarian = await User.findAll({where: {roleUuid: 1}, include: [UserDetailes]});
	return res.json(readersToLibrarian.map((user) => {
		user = user.userdetaile.dataValues;
		return user;
	}));
});

module.exports = app;
