const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    /*
    ,
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    userImage: {
        type: Buffer,
        required: true
    },
    userImageType: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    signedUpAt: {
        type: Date,
        required: true,
        default: Date.now
    }*/
});

module.exports = mongoose.model('User', userSchema);