const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// =====================
// Task 6 - Register User
// =====================
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(201).json({ message: "User successfully registered" });
});


// =====================
// Task 10 - Get All Books (Async)
// =====================
public_users.get('/', async function (req, res) {

  try {
    const bookData = await Promise.resolve(books);
    return res.status(200).json(bookData);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }

});


// =====================
// Task 11 - Get Book by ISBN (Async)
// =====================
public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  try {
    const bookData = await Promise.resolve(books);
    const book = bookData[isbn];

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book" });
  }

});


// =====================
// Task 12 - Get Books by Author (Async)
// =====================
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {
    const bookData = await Promise.resolve(books);

    const filteredBooks = {};

    Object.keys(bookData).forEach((key) => {
      if (bookData[key].author === author) {
        filteredBooks[key] = bookData[key];
      }
    });

    if (Object.keys(filteredBooks).length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }

});


// =====================
// Task 13 - Get Books by Title (Async)
// =====================
public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {
    const bookData = await Promise.resolve(books);

    const filteredBooks = {};

    Object.keys(bookData).forEach((key) => {
      if (bookData[key].title === title) {
        filteredBooks[key] = bookData[key];
      }
    });

    if (Object.keys(filteredBooks).length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }

});


// =====================
// Get Book Reviews
// =====================
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

});


module.exports.general = public_users;
