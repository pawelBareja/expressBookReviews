const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users.push({ username, password });
  res.status(201).json({ message: `User ${username} has been added` });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  const booksList = JSON.stringify(books, 2, null);
  res.status(200).json(booksList);

  return res.status(300).json({ message: 'Yet to be implemented' });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  console.log(isbn, book);
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: 'Book not found' });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookList = Object.values(books).filter(
    (book) => book.author === author
  );

  if (bookList.length > 0) {
    return res.status(200).json(bookList);
  }

  return res.status(404).json({ message: 'No books matching' });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookList = Object.values(books).filter((book) => book.title === title);

  if (bookList.length > 0) {
    return res.status(200).json(bookList);
  }

  return res.status(404).json({ message: 'No books matching' });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookReview = books[isbn].reviews;

  if (bookReview) {
    return res.status(200).json(bookReview);
  }

  return res.status(404).json({ message: 'No books matching' });
});

module.exports.general = public_users;
