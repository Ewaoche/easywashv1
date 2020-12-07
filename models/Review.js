const mongoose = require('mongoose');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendor',
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


//Static method to get avg of course tuitions
ReviewSchema.statics.getAverageRating = async function(vendorId) {
    const obj = await this.aggregate([{
            $match: {
                vendor: vendorId
            }
        },
        {
            $group: {
                _id: '$vendor',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(obj);
    try {
        await this.model('vendor').findByIdAndUpdate(vendorId, {
            averageRating: obj[0].averageRating
        });
    } catch (err) {
        console.error(err);
    }
}

//Call getAverageRating after save
ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.vendor);
});



module.exports = mongoose.model('Review', ReviewSchema);