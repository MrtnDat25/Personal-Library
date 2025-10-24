'use strict';

const { Book } = require('../models');

module.exports = function (app) {
  
  app.route('/api/books')
    // ===== GET ALL BOOKS =====
    .get(async function (req, res) {
      try {
        const books = await Book.find({});
        const formattedBooks = books.map(b => ({
          _id: b._id,
          title: b.title,
          commentcount: b.comments.length
        }));
        res.json(formattedBooks);
      } catch (err) {
        res.json([]);
      }
    })

    // ===== CREATE NEW BOOK =====
    .post(async function (req, res) {
      const title = req.body.title;
      if (!title) return res.send("missing required field title");

      try {
        const newBook = new Book({ title, comments: [] });
        const savedBook = await newBook.save();
        res.json({ _id: savedBook._id, title: savedBook.title });
      } catch (err) {
        res.send("there was an error saving the book");
      }
    })

    // ===== DELETE ALL BOOKS =====
    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        res.send("complete delete successful");
      } catch (err) {
        res.send("there was an error deleting all books");
      }
    });



  app.route('/api/books/:id')
    // ===== GET BOOK BY ID =====
    .get(async function (req, res) {
      const bookid = req.params.id;
      try {
        const book = await Book.findById(bookid);
        if (!book) return res.send("no book exists");

        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (err) {
        res.send("no book exists");
      }
    })

    // ===== ADD COMMENT TO BOOK =====
    .post(async function (req, res) {
  const bookid = req.params.id;
  const comment = req.body.comment;
  if (!comment) return res.send("missing required field comment");

  try {
    const book = await Book.findById(bookid);
    if (!book) return res.send("no book exists");

    book.comments.push(comment);
    const updatedBook = await book.save();

    res.json({
      _id: updatedBook._id,
      title: updatedBook.title,
      comments: updatedBook.comments
    });
  } catch (err) {
    // Nếu id không hợp lệ hoặc xảy ra lỗi khác -> "no book exists"
    return res.send("no book exists");
  }
})


    // ===== DELETE ONE BOOK =====
    .delete(async function (req, res) {
      const bookid = req.params.id;
      try {
        const deleted = await Book.findByIdAndDelete(bookid);
        if (!deleted) return res.send("no book exists");
        res.send("delete successful");
      } catch (err) {
        res.send("no book exists");
      }
    });
};
