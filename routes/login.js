const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

const initializePassport = require('../passport-config');
initializePassport(
    passport,
    async uName => await User.findOne({ uName: uName}).exec(),
    async id => await User.findById(id)
);

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('login/index');
});

router.post('/', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '../',
    failureRedirect: '../login',
    failureFlash: true //so a message can be displayed to the user
}));

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}
function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }

    next();
}

module.exports = router;