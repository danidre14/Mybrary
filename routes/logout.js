const express = require('express');
const router = express.Router();

router.delete('/', checkAuthenticated, (req, res) => {
  req.logOut();
  res.redirect('../');
});

function checkAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
      return next();
  }

  res.redirect('../');
}

module.exports = router;