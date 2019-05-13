const Book = require("../../schemas/library/books");
const BookRating = require("../../schemas/bookInfo/bookRating");
const {User, UserDetailes, UserOrder, Status} = require("../../../sequelize");

const findBookForOrder = async order => {
	order.dataValues.book = await Book.findById(order.dataValues.bookId).then(bookInfo => {
		return bookInfo.toClientOrders();
	});
	return order;
};

async function getUserOrders(userId) {
	let sendData = await UserOrder.findAll({where: {userId: userId}, include: [Status]}).then(async (orders) => {
		const getData = async () => {
			return await Promise.all(orders.map(order => findBookForOrder(order)))
		};
		return getData().then(result => result);
	});
	return sendData;
}

function addUserOrder(userId, bookId) {
	UserOrder.create({bookId: bookId, userId: userId, statusId: 1}).then(order => {
		return (order);
	});
	BookRating.update(
		{bookId: bookId},
		{$inc: {ordersCount: 1}}
	).then(incr => incr);
}

async function getAllOrders() {
	let sendData = await UserOrder.findAll({
		include: [{
			model: User,
			include: [UserDetailes]
		}, {model: Status}]
	}).then(async (orders) => {
		// console.log(orders[0].dataValues.user.dataValues.userdetaile.dataValues.cardnumber);
		const getData = async () => {
			return await Promise.all(orders.map(order => findBookForOrder(order)))
		};
		return getData().then(result => result);
	});
	return sendData;
}

async function editOrder(orderId, orderNewInfo) {
	let updateStatus = {
		statusId: +orderNewInfo.statusId
	};
	let options = {
		where: {id: orderId}
	};
	if (+orderNewInfo.statusId === 2) {
		let sendData = await UserOrder.update(updateStatus, options).then(() => {
			Book.update(
				{_id: orderNewInfo.bookId},
				{$inc: {availableCount: -1}}
			).then(dicr => dicr);
			return UserOrder.findOne({
				where: {id: orderId},
				include: [{model: User, include: [UserDetailes]}, {model: Status}]
			}).then(newOrder => {
				newOrder = findBookForOrder(newOrder);
				return newOrder
			});
		});
		return sendData;
	}
}

async function deleteOrder(orderId) {
	let sendData = await UserOrder.findOne({where: {id: orderId}}).then(orderToDelete => {
		Book.update(
			{_id: orderToDelete.bookId},
			{$inc: {availableCount: 1}}
		).then(dicr => dicr);
		return orderToDelete.destroy();
	});
	return sendData;
}

async function editOrderByUser(orderId, orderNewInfo) {
	let updateStatus = {
		statusId: +orderNewInfo.statusId
	};
	let options = {
		where: {id: orderId}
	};
	if (+orderNewInfo.statusId === 4) {
		let sendData = await UserOrder.update(updateStatus, options).then(() => {
			return UserOrder.findOne({
				where: {id: orderId},
				include: [{model: User, include: [UserDetailes]}, {model: Status}]
			}).then(newOrder => {
				newOrder = findBookForOrder(newOrder);
				return newOrder
			});
		});
		return sendData;
	}
}

module.exports = {
	getUserOrders,
	getAllOrders,
	addUserOrder,
	editOrder,
	deleteOrder,
	editOrderByUser
};