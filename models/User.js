const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const geocoder = require('../utils/geocoder');

UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'vendor'],
        required: [true, 'please provide role']

    },

    profession: {
        type: String
    },

    image: {
        type: String,
        default: 'no-photo.jpg'
    },


    isVerify: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        required: [true, ['please provide address']]
    },


    phone: {
        type: String,
        required: [true, ['please provide phone number']]
    },

    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },


    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: moment()
    }

});



UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Sign jwt and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};


//Match User entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Generate and Hash password Token
UserSchema.methods.getResetPasswordToken = function(req, res, next) {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash Token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    //set token expiration
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

module.exports = mongoose.model('User', UserSchema);