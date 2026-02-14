const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// =============================
// Register New User (Task 6)
// =============================
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


// =====================================================
// Helper Route (Used Internally by Axios) – Returns All Books
// =====================================================
public_users.get('/books', (req, res) => {
  return res.status(200).json(books);
});


// =============================
// Task 10 – Get All Books (Async + Axios)
// =============================
public_users.get('/', async function (req, res) {

  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }

});


// =============================
// Task 11 – Get Book by ISBN
// =============================
public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  try {
    const response = await axios.get('http://localhost:5000/books');
    const bookData = response.data;

    if (bookData[isbn]) {
      return res.status(200).json(bookData[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book" });
  }

});


// =============================
// Task 12 – Get Books by Author
// =============================
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {
    const response = await axios.get('http://localhost:5000/books');
    const bookData = response.data;

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


// =============================
// Task 13 – Get Books by Title
// =============================
public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {
    const response = await axios.get('http://localhost:5000/books');
    const bookData = response.data;

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


// =============================
// Get Book Reviews
// =============================
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
