const express = require("express");
const app = express();
const { UserDetailes } = require("../../sequelize");

app.get("/", async (req, res) => {
    const userDetailes = await UserDetailes.findAll();
    res.send(userDetailes);
});

module.exports = app;
