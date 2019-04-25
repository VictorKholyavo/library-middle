const mysql = require("mysql");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require('passport');
const UsersController = require("./server/controllers/users");
const UsersDetailesController = require("./server/controllers/usersDetailes");
const RolesController = require("./server/controllers/roles");
const GenresController = require("./server/controllers/genres");
const BooksController = require("./server/controllers/books");
const OrderController = require("./server/controllers/userOrder");
// const PhonesController = require("./server/controllers/phones");
// const { Users, Phones } = require('./sequelize');
const StatusController = require("./server/controllers/status");
const StartDataController = require("./server/controllers/startData");
const CommentsController = require("./server/controllers/comment");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/users", UsersController);
app.use("/usersdetailes", UsersDetailesController);
app.use("/roles", RolesController);

app.use("/genres", passport.authenticate('jwt', {session: false}),  GenresController);
app.use("/books", passport.authenticate('jwt', {session: false}), BooksController);

app.use("/order", passport.authenticate('jwt', {session: false}), OrderController);
app.use("/status", passport.authenticate('jwt', {session: false}), StatusController);

app.use("/startData", StartDataController);
app.use("/comments", passport.authenticate('jwt', {session: false}), CommentsController);

app.listen(3016, function () {
	console.log("API app started");
});
