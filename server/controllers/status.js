const express = require("express");
const app = express();
const { Status } = require("../../sequelize");

app.get("/", async (req, res) => {
    const statuses = await Status.findAll();
    return res.send(statuses.map((status) => {
        let id = status.id;
        status = status.dataValues;
        status.id = id;
        status.value = status.status;
        return status;
    }));
});

module.exports = app;