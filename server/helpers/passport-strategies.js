const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcrypt");

const {User, UserDetailes, Roles} = require("../../sequelize");

passport.use(new JWTStrategy(
	{
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

module.exports = passport;