const express = require("express");
const app = express();
const { Roles } = require("../../sequelize");

app.get("/", async (req, res) => {
    const roles = await Roles.findAll();
    return res.send(roles.map((role) => {
        let id = role.uuid;
        role = role.dataValues;
        role.id = id;
        role.value = role.role;
        delete role.uuid;
        return role;
    }));
});

module.exports = app;