const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', checkNotAuthenticated, (req, res) => {
    //check for mini errors
    const uMessage = req.session.uMessage || "";
    req.session.uMessage = null;
    const pMessage = req.session.pMessage || "";
    req.session.pMessage = null;
    
    res.render('register/index', {uMessage: uMessage, pMessage: pMessage});
});

router.post('/', checkNotAuthenticated, validateInfomation, checkUserExists, createUser); 

function validateInfomation(req, res, next) {
    //username validation
    let uName = req.body.uName;
    let uError = false;
    let uMessage = "";
    if(uName.length < 4 || uName.length > 15) {
        uMessage += "-Must be 4-15 characters long";
        uError = true;
    } else {
        if(uName.charAt(0).match(/^[a-z]+$/ig) === null) {
            uMessage += "-Username must start with a letter\n";
            uError = true;
        } else if(uName.match(/^[a-z][a-z\d]+$/ig) === null) {
            uMessage += "-Symbols not allowed";
            uError = true;
        } 
    }
    
    //password validation
    let pName = req.body.password;
    let pError = false;
    let pMessage = "";
    if(pName.length < 8) {
        pMessage += "-Password must be 8 or more characters\n";
        pError = true;
    }
    if(pName.match(/^[a-z\d]+$/ig) === null) {
        pMessage += "-Password cannot contain symbols or spaces\n";
        pError = true;
    }
    if(pName.search(/\d/) === -1) {
        pMessage += "-Must contain at least one number\n";
        pError = true;
    }
    if(pName.search(/[A-Z]/) === -1) {
        pMessage += "-Must contain at least one uppercase letter\n";
        pError = true;
    }
    if(pName.search(/[a-z]/) === -1) {
        pMessage += "-Must contain at least one lowercase letter";
        pError = true;
    }

    //redirect if needed
    if(uError || pError) { 
        req.session.uMessage = uMessage;
        req.session.pMessage = pMessage;
        return res.redirect('register');
    }

    next();
}

async function createUser(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //users.push
        const user = new User({
            uName: req.body.uName,
            email: req.body.email,
            password: hashedPassword
        });
        const newUser = await user.save();
        res.redirect('../login');
        //res.redirect(`users/${newUser.uName}`);
    } catch (err) {
        console.log(err)
        res.redirect('register');
    }
    //console.log(await User.find({}).exec());
}

async function checkUserExists(req, res, next) {
    //if user already exists
    if(await User.findOne({uName:req.body.uName}) !== null) {
        req.session.uMessage = "Username unavailable";
        return res.redirect('register');
    }
        //res.locals.userExists = true;

    next();
}
function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }

    next();
}

module.exports = router;