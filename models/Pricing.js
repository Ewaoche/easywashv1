const mongoose = require('mongoose');
const moment = require('moment');
const User = require('./User');


const PricingSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, 'please provide item name']
    },
    description: {
        type: String,
        required: [true, 'please provide description'],
    },
    estimatedTime: {
        type: String,
        required: [true, 'please provide estimated time'],
    },
    price: {
        type: String,
        required: [true, 'please provide item price'],
    },

    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

    createdAt: {
        type: Date,
        default: moment()
    }

});


module.exports = mongoose.model('Pricing', PricingSchema);