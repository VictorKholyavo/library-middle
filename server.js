const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const RolesController = require("./server/controllers/roles");
const StatusController = require("./server/controllers/status");
const StartDataController = require("./server/controllers/startData");

const routes = require("./server/routes");
const auth_routes = require("./server/routes/auth_routes");

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/myapir", function (err) {
	app.use("/", passport.authenticate("jwt", {session: false}), routes);
});

app.use("/auth", auth_routes);

app.use("/roles", RolesController);

app.use("/status", passport.authenticate("jwt", {session: false}), StatusController);

app.use("/startData", StartDataController);

app.listen(3016, function () {
	console.log("API app started");
});
