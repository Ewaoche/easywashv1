const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const geocoder = require('../utils/geocoder');


// const GeoSchema = new mongoose.Schema({
//     type: {
//         type: String,
//         default: "Point"
//     },
//     coordinates: {
//         type: [Number],
//         index: "2dsphere"
//     }
// });


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

    // location: {
    //     // GeoJSON Point
    //     type: {
    //         type: String,
    //         enum: ['Point']
    //     },
    //     coordinates: {
    //         type: [Number],
    //         index: '2dsphere'
    //     },
    //     formattedAddress: String,
    //     street: String,
    //     city: String,
    //     state: String,
    //     zipcode: String,
    //     country: String
    // },



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

    // geometry: GeoSchema,

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: moment()
    }

});



//Geocode and create loaction field

// UserSchema.pre('save', async function(next) {
//     const loc = await geocoder.geocode(this.address);
//     this.location = {
//             type: 'Point',
//             coordinates: [loc[0].longitude, loc[0].latitude],
//             formattedAddress: loc[0].formattedAddress,
//             street: loc[0].streetName,
//             city: loc[0].city,
//             state: loc[0].stateCode,
//             zipcode: loc[0].zipcode,
//             country: loc[0].countryCode

//         },

//         //Do not store Address in DB
//         this.address = undefined;
//     next();


// });

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