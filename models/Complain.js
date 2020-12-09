const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('./User');
const moment = require('moment');


const ComplainSchema = new mongoose.Schema({
    complain: {
        type: String,
        required: [true, 'please write a complain']
    },
    orderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
        required: [true, 'please entere an order']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'please write a complain']
    },
    createdAt: {
        type: Date,
        default: moment()
    }
});

module.exports = mongoose.model('Complain', ComplainSchema);