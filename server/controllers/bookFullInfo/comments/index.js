const Comments = require("../../../schemas/bookFullInfo/comments");

function getComments(req, res) {
	let comments = Comments.find();
	return res.json(comments.map(comment => comment.toClient()));
}

module.exports = {
	getComments
};
