const express = require("express");
const app = express();
const multer  = require("multer");
const passport = require('passport');
const moveFile = require('move-file');
const { Books, Genres, Cover, BookFiles, BookAudioFiles, User, Like } = require("../../sequelize");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/uploads");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage: storage });

// BOOKS //

app.get("/", async (req, res) => {
	let titleFilter = req.query.filter && req.query.filter.title ? {[Op.like]: '%'+req.query.filter.title+'%'} : {[Op.like]: '%%'};
	let authorNameFilter = req.query.filter && req.query.filter.author ? {[Op.like]: '%'+req.query.filter.author+'%'} : {[Op.like]: '%%'};
	let authorSurnameFilter = req.query.filter && req.query.filter.author ? {[Op.like]: '%'+req.query.filter.author+'%'} : {[Op.like]: '%%'};
	let authorPatronymicFilter = req.query.filter && req.query.filter.author ? {[Op.like]: '%'+req.query.filter.author+'%'} : {[Op.like]: '%%'};
	let data = [];
	let order = [];
	let where = {};
	if (req.query.start && req.query.count) {
		if (req.headers.filteringcolumn !== "") {
			switch(req.headers.filteringcolumn) {
				case "year":
					order = ["year", "ASC"];
					where = {};
					break;
				case "pages":
					order = ["pages", "DESC"];
					where = {};
					break;
				case "title":
					order = [Sequelize.fn('length', Sequelize.col('title')), 'DESC'];
					where = {};
					break;
				case "country":
					order = ["year", "ASC"];
					where = {country: "Spain", year: {[Op.between]: [1980, 2000]}};
					break;
				case "files":
					order = "check audio files and available count";
					break;
			}
			if (order === "check audio files and available count") {
				data = await Books.findAll({where: where, include: [Genres, Cover, BookFiles, BookAudioFiles]}).then((books) => {
					let filteredBook = books.map(function (book) {
						if (book.bookAudios.length > 0 && book.bookFiles.length === 0 && book.availableCount > 0) {
							book = book.dataValues;
							return book;
						}
						// if (book.dataValues.availableCount > 0 && book.bookAudios.length > 0 && book.bookFiles.length === 0) {
						// 	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!');
						// }
					})
					return filteredBook
				});
				data = data.filter(function (x) {
					return x !== undefined;
				});
				console.log(data);

				return res.json(data);
			}
			else {
				data = await Books.findAll({where: where, limit: 10, order: [order], include: [Genres, Cover]});
				return res.json(data);
			}
		}
		else {
			data = await Books.findAll({where: {title: titleFilter, [Op.or]: [{authorName: authorNameFilter}, {authorSurname: authorSurnameFilter}, {authorPatronymic: authorPatronymicFilter}]}, offset: +req.query.start, limit: +req.query.count, include: [Genres, Cover]}).then(booksBooks => {
	        booksBooks.map(function (book) {
						let likes = null;
						book.getUsers().then((users) => {
							likes = users.length;
							book.dataValues.likes = users.length;
							return likes
						});
            // book = book.dataValues;
            book.genres.map(function (genreOfOneBook) {
                let genre = {id: genreOfOneBook.dataValues.id, genre: genreOfOneBook.dataValues.genre};
                genreOfOneBook = genre;
                return genreOfOneBook
            });
						book.dataValues.likes = likes;
            return book;
	        });
					return booksBooks
	    });
		}
	}
	Books.count().then(function (count) {
			res.json({"pos": +req.query.start, "data": data, "total_count": +count});
	});
});

app.get("/popularauthors", async (req, res) => {
	let authorsByBooksCount = await Books.findAll({group: ["authorName", "authorSurname", "authorPatronymic"], attributes: ["authorName", "authorSurname", "authorPatronymic", [Sequelize.fn('COUNT', 'authorSurname'), 'BooksCount']], order: [[Sequelize.literal('BooksCount'), 'DESC']]}).then(function (books) {
		books.map(function (book, index) {
			book = book.dataValues;
			return book;
		});
		return books
	});
	Promise.all(authorsByBooksCount).then((completed) => {
		return res.json(completed)
	});
})

app.put("/:id", async (req, res) => {
    let updateBook = {
        title: req.body.title,
        pages: req.body.pages,
        year: req.body.year,
        author: req.body.author,
        publisher: req.body.publisher,
        country: req.body.country,
        availableCount: req.body.availableCount
    }
    let options = {
        where: {id: req.body.id}
    }
    Books.update(updateBook, options);
    let sendData = [];

    Books.findOne({where: {id: req.body.id}, include: [Genres] }).then((book) => {

        book.genres.map(function (genre) {
            genre.removeBook(req.body.id)
        })
        let genresOfUpdatedBook = [];
        for (const key in req.body) {
            if (key.substring(0, 5) === "genre" && key.substring(5, 6) !== "s") {
                genresOfUpdatedBook.push(req.body[key]);
            }
        }

        let sendData = genresOfUpdatedBook.map((genreOfUpdatedBook) => {
            return Genres.findOne({where: {id: genreOfUpdatedBook}})
                .then((genre) => {
                    return genre.addBook(req.body.id);
                });
        });
        Promise.all(sendData).then((completed) => {
            Books.findOne({where: {id: req.body.id}, include: [Genres] }).then((book) => {
                return res.send(book)
            })
        });
    });
});

app.put("/order/:id", async (req, res) => {
    console.log(req.body);
    Books.findOne({where: {id: req.body.id}}).then((book) => {
        return book.decrement("availableCount", {by: 1})
    }).then(book => {
        book.reload().then((book) => {
            return res.send(book)
        })
    });
})

app.post("/uploadFiles", upload.fields([{name: "text", maxCount: 3}, {name: "audio", maxCount: 3}]), async (req, res) => {
    let text = await req.files.text;
    let audio = await req.files.audio;

    if (req.body.id) {
        Books.findOne({where: {id: req.body.id} }).then((book) => {
            if (text) {
                text.map(function (textfile) {
                    let oldPath = textfile.destination + "/" + textfile.filename;
                    let newPath = textfile.destination + "/textfiles/" + textfile.filename;
                    moveFile(oldPath, newPath)
                    book.createBookFile(({fileType: textfile.mimetype, path: newPath, size: textfile.size, bookId: req.body.id}));
                    return textfile
                });
            }
            if (audio) {
                audio.map(function (audiofile) {
                    let oldPath = audiofile.destination + "/" + audiofile.filename;
                    let newPath = audiofile.destination + "/audiofiles/" + audiofile.filename;
                    moveFile(oldPath, newPath)
                    book.createBookAudio(({fileType: audiofile.mimetype, path: newPath, size: audiofile.size, bookId: req.body.id}));
                    return audiofile
                })
            }
        })
    }
})

app.post("/add", upload.single("upload"), async (req, res) => {
    try {
        let newBook = req.body;
        Books.create(newBook).then((book) => {
            let genresOfNewBook = [];
            for (const key in newBook) {
                if (key.substring(0, 5) === "genre") {
                    genresOfNewBook.push(newBook[key]);
                }
            }
            genresOfNewBook.map(function (genreOfNewBook) {
                Genres.findOne({where: {id: genreOfNewBook}})
                .then((genre) => {
                    genre.addBook(book.dataValues.id);
                })
            });
            return book
        })
        .then((book) => {
            let path = req.file.destination + "/" + req.file.filename;
            book.createCover({path: path, fileType: req.file.mimetype, bookId: book.dataValues.id});
            res.send(book);
        });
    } catch (error) {

    }

});

//GET BOOK FULL INFORMATION//

app.get("/like/:id", async (req, res) => {
	Books.findOne({where: {id: req.params.id}}).then((book) => {
		book.getUsers().then((users) => {
			console.log(users.length);
			return res.json(users.length)
		})
		return
	})
})

app.post("/like", async (req, res) => {
	try {
		Books.findOne({where: {id: req.body.bookId}}).then((book) => {
			book.getUsers().then((users) => {
				users.map(function (user) {
					if (user.dataValues.id === req.user.id) {
						return res.status(405).send("You already liked this book")
					}
				})
				return book
			}).then((book) => {
				book.addUser(req.user.id).then((like) => {
					book.getUsers().then((likesCount) => {
						console.log(likesCount.length);
						return res.json(likesCount.length)
					})
					return
				})
			})
		})
	} catch (e) {
			res.send(e)
	}
});


module.exports = app;
