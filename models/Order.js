const mongoose = require('mongoose');
const moment = require('moment');
const User = require('../models/User');
const Pricing = require('./Pricing');

const OrderSchema = new mongoose.Schema({

    orderType: {
        type: String,
        enum: ['Self Drop-off/Pickup', 'Vendor Pickup/Delivery'],
        default: 'Self Drop-off/Pickup'
    },

    dropOffDate: {
        type: Date,
        default: moment().format("dddd Do MMMM YYYY")
    },
    pickOffDate: {
        type: Date,
        default: moment().format("dddd Do MMMM YYYY")
    },

    washType: {
        type: String,
        enum: ['Normal-wash', 'Dry-wash', 'Express-wash'],
        default: 'Normal-wash'
    },
    // orderItems: [{
    //         name: { type: String, required: [true, 'please provide item name'] },
    //         price: { type: Number, required: [true, 'please provide price'] }
    //     },

    // ],
    orderItems: {
        type: mongoose.Schema.ObjectId,
        ref: 'Pricing',
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: [true, 'please provide a user']
    },
    isDelivered: {
        type: String,
        default: false
    },

    orderStatus: {
        type: String,
        enum: ['pending', 'completed', 'inprogress'],
        default: 'pending'
    },

    deliveredAt: { type: Date, default: moment() },

    completedOrder: { type: Number, default: 0 },

    completedOrderAt: { type: Date, default: moment() },

    createdAt: {
        type: String,
        default: moment().format("dddd Do MMMM YYYY")
    }

});


module.exports = mongoose.model('Order', OrderSchema);