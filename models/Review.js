const mongoose = require('mongoose');
const User = require('../models/User');
const moment = require('moment');

const ReviewSchema = new mongoose.Schema({

    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    text: {
        type: String,
        required: [true, 'please provide review text']
    },
    createdAt: {
        type: Date,
        default: moment()
    },

    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

//Preventing users from submitting more than one review per vendor
ReviewSchema.index({ vendor: 1, user: 1 }, { unique: true });





module.exports = mongoose.model('Review', ReviewSchema);