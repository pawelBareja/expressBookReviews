const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => {
  // Returns boolean
  // Write code to check if username and password match the one we have in records
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'fingerprint_customer', {
      expiresIn: '1h',
    });
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const username = req.user.username;

  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: 'Review added/updated successfully' });
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  const username = req.user.username;
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (books[isbn]?.reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: 'Review deleted successfully' });
  } else {
    return res.status(404).json({ message: 'Review not found' });
  }
});
// });

module.exports.authenticated = regd_users;
module.exports.users = users;
