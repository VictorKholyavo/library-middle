const express = require("express");
const app = express();
const { Genres } = require("../../sequelize");

app.get("/", async (req, res) => {
    const genres = await Genres.findAll();
    res.send(genres);
});

module.exports = app;