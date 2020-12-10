const mongoose = require('mongoose');
const moment = require('moment');

const StoreLocationSchema = new mongoose.Schema({
    address: {
        type: String,
        required: [true, 'please add location']
    },
    email: {
        type: String,
        required: [true, 'please provide email']
    },
    phone: {
        type: String,
        required: [true, 'please provide phone']
    },

    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'please provide creator']

    },


    createdAt: {
        type: Date,
        default: moment()
    }
});



module.exports = mongoose.model('StoreLocation', StoreLocationSchema);