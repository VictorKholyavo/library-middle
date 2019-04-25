const express = require("express");
const app = express();
const { User, UserDetailes, Books, UserOrder, Cover, Status } = require("../../sequelize");
const passport = require('passport');

// LIBRARIAN WORK WITH ORDERS //

app.get("/", async (req, res) => {
    const usersOrders = await UserOrder.findAll({include: [{model: User, include: [UserDetailes]}, {model: Books, include: [Cover]}, {model: Status}]});
    return res.send(usersOrders.map(function (order) {
        order = order.dataValues;
        order.user = order.user.dataValues.userdetaile.dataValues;
        order.book = order.book.dataValues;
        order.status = order.status.dataValues;
        order.cover = order.book.cover.dataValues;
        return order
    }));
});

app.put("/:id", async (req, res) => {
    try {
			console.log(req.body);
        let updateStatus = {
            statusId: +req.body.status
        }
        let options = {
            where: {id: +req.body.id}
        }
        if (req.body.status && req.body.id) {
            UserOrder.update(updateStatus, options).then(() => {
                UserOrder.findOne({where: {id: +req.body.id}, include: [{model: User, include: [UserDetailes]}, {model: Books, include: [Cover]}, {model: Status}]}).then((updatedOrder) => {
									console.log(updatedOrder);
                    updatedOrder = updatedOrder.dataValues;
                    updatedOrder.user = updatedOrder.user.dataValues.userdetaile.dataValues;
                    updatedOrder.book = updatedOrder.book.dataValues;
                    updatedOrder.status = updatedOrder.status.dataValues;
                    updatedOrder.cover = updatedOrder.book.cover.dataValues;
                    if (updatedOrder.status.id === "2") {
                        Books.findOne({where: {id: req.body.bookId}}).then((book) => {
                            if (book.dataValues.availableCount > 0) {
                                return book.decrement("availableCount", {by: 1});
                            }
                            else {
                                return res.status(401).send("No more books left")
                            }
                        }).then(book => {
                            book.reload().then((book) => {
                                updatedOrder.book = book;
                                return res.json(updatedOrder);
                            })
                        });
                    }
                    else if (updatedOrder.status.id === "5" && req.body.return) {
                        Books.findOne({where: {id: req.body.bookId}}).then((book) => {
                            return book.increment("availableCount", {by: 1});
                        });
                    }
                    else {
                        return res.json(updatedOrder);
                    }
                })
            });
        }
    } catch (error) {
        res.send(error)
    }
});

app.delete("/:id", async (req, res) => {
    UserOrder.findOne({where: {id: req.body.id}}).then(orderForDelete => {
        return res.json(orderForDelete.destroy());
    });
});

// USER WORK WITH ORDERS //

app.get("/user", async (req, res) => {
    console.log(req.user.id);
    const userOrders = await UserOrder.findAll({where: {userId: req.user.id}, include: [{model: Books, include: [Cover]}, {model: Status}]});
    // console.log(userOrders);
    return res.send(userOrders.map(function (order) {
        order = order.dataValues;
        order.book = order.book.dataValues;
        order.status = order.status.dataValues;
        order.cover = order.book.cover.dataValues;
        return order
    }));
});

app.post("/add", async (req, res) => {
    try {
        UserOrder.create({bookId: req.body.bookId, userId: req.user.id, statusId: 1}).then((order) => {
            return res.send(order)
        })
    } catch (error) {
        res.send(error)
    }

});

app.put("/user/:id", async (req, res) => {
		console.log(req.body.status);
    let updateStatusToReturn = {
        statusId: +req.body.status
    }
    let options = {
        where: {id: +req.body.id}
    }
    UserOrder.update(updateStatusToReturn, options).then((order) => {
        return order
    }).then(() => {
        UserOrder.findOne({where: {id: req.body.id}, include: [{model: Books, include: [Cover]}, {model: Status}]}).then((updatedOrder) => {
            return updatedOrder
        }).then(updatedOrder => {
            updatedOrder.reload().then((updatedOrder) => {
                return res.send(updatedOrder)
            })
        });
    });
})

module.exports = app;
