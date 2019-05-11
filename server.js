const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const UsersController = require("./server/controllers/users");
const UsersDetailesController = require("./server/controllers/usersDetailes");
const RolesController = require("./server/controllers/roles");
const OrderController = require("./server/controllers/userOrder");
const StatusController = require("./server/controllers/status");
const StartDataController = require("./server/controllers/startData");

const GenresMongoController = require("./server/controllers/library/genre");

const routes = require("./server/routes");

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/myapir", function (err) {
	app.use("/", passport.authenticate("jwt", {session: false}), routes);
	app.use("/genres", GenresMongoController);
});

app.use("/users", UsersController);
app.use("/usersdetailes", UsersDetailesController);
app.use("/roles", RolesController);

app.use("/order", passport.authenticate("jwt", {session: false}), OrderController);
app.use("/status", passport.authenticate("jwt", {session: false}), StatusController);

app.use("/startData", StartDataController);

app.listen(3016, function () {
	console.log("API app started");
});
