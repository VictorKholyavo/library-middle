const express = require("express");
const app = express();
const passport = require('passport');
const { Comment, User, Books } = require("../../sequelize");

app.get("/", async (req, res) => {
    const comments = await Comment.findAll();
    return res.send(comments);
});

// app.get("/:id", async (req, res) => {
//   const commentsForBook = await Comment.findAll({where: {bookId: req.params.id}, include: [User]}).then((comments) => {
// 		comments.map((comment) => {
// 			console.log(comment);
// 			comment = comment.dataValues;
// 			comment.userEmail = comment.user.dataValues.email;
// 			delete comment.user;
// 			comment.data = [];
// 			comment.value = comment.userEmail + ": " + comment.text;
// 			comments.map((answer) => {
// 				if (answer.parentId === comment.id) {
// 					comment.data.push(answer)
// 				}
// 				return answer;
// 			});
// 			return comment;
// 		});
// 		return comments;
// 	});
// 	Promise.all(commentsForBook).then((completed) => {
// 		return res.json(completed)
// 	});
// });

app.get("/:id", async (req, res) => {
	const commentsForBook = await Comment.findAll({where: {bookId: req.params.id}}).then((comments) => {
		comments.map((comment) => {
			comment = comment.dataValues;
			return comment;
		});
		return comments
	})
	res.json(commentsForBook)
});

app.get("/answers/:id", async (req, res) => {
	const answersForComment = await Comment.findAll({where: {parentId: req.params.id}}).then((answers) => {
		answers.map((answer) => {
			answer = answer.dataValues;
			return answer;
		});
		return answers
	})
	res.json(answersForComment)
});

app.post("/addcomment", async (req, res) => {
    try {
			Comment.create({bookId: req.body.bookId, user_id: req.user.id, text: req.body.text, date: req.body.date}).then((comment) => {
				return res.send(comment)
			});
    } catch (error) {
        res.send(error)
    }
});

app.post("/answers/addanswer", async (req, res) => {
    try {
			Comment.create({bookId: req.body.bookId, user_id: req.user.id, text: req.body.text, date: req.body.date, parentId: req.body.parentId}).then((comment) => {
				return res.send(comment)
			});
    } catch (error) {
        res.send(error)
    }
});

module.exports = app;
