const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Validate user
  const validUser = users.find(
    (user) => user.username === username && user.password === password,
  );

  if (!validUser) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  // Create JWT token
  const token = jwt.sign({ username: username }, "access", { expiresIn: "1h" });

  req.session.authorization = {
    accessToken: token,
  };

  return res.status(200).json({
    message: "User successfully logged in",
    token: token,
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code her
  const isbn = req.params.isbn;
  const review = req.query.review;

  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({ message: "Review content required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added/updated",
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
