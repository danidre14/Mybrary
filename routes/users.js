const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/', (req, res) => {
    res.send("Remember this page should not exist, and you must redirect it soon")
});

router.get('/users/:id', (req, res) => {
    res.send("ID Page for the user")
});

//Create Author Route
router.post('/', async (req, res) => {
    /*const user = new User({
        uName: req.body.name
    });
    try {
        const newUser = await user.save();
        res.redirect(`users/${newUser.uName}`);
    } catch {
        /*res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        });*/
    //}
});

