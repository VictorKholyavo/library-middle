const mongoose = require("mongoose");
const express = require("express");
const app = express();
const multer  = require("multer");
const Cover = require("../../schemas/library/cover");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	cb(null, "./public/uploads/cover");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post("/", upload.single("upload"), async function(req, res) {
	let path = req.file.destination + "/" + req.file.originalname;

	let cover = await new Cover ({
		path: path
	})
	cover.save();

	res.send({"server": "server", "path": path})
});

module.exports = app;
