const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', checkAuthenticated, async (req, res) => {
  let books;
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
  } catch {
    books = [];
  }
  if(req.isAuthenticated())
    res.render('index', { uName: req.user.uName, 
  books: books });
  else
    res.render('index', {books: books });

});

function checkAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
      return next();
  }

  next();
  //res.redirect('/login');
}
function checkNotAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
      return res.redirect('/');
  }

  next();
}

module.exports = router;