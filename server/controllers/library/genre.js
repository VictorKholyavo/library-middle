const express = require("express");
let app = express();
const mongoose = require("mongoose");
const Genre = require("../../schemas/library/genre");

app.get("/", async (req, res) => {
	try {
		const genres = await Genre.find().exec();
		res.send(genres.map(genre => genre.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post("/add", async (req, res) => {
	try {
		let newGenre = await new Genre ({
			name: req.body.name
		});
		newGenre.save();
	}
	catch (error) {
		console.log(error);
	}
});

app.get("/add", async (req, res) => {
	try {
		let newGenre = await new Genre ({
			name: "Drama"
		});
		newGenre.save();
	}
	catch (error) {
		console.log(error);
	}
});

module.exports = app;
