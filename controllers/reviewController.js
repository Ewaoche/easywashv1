const asyncHandler = require('../middleware/async');

const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const User = require('../models/User');


// @desc      Add review
// @route     POST /api/v1/vendor/:vendorId/reviews
// @access    Private
const createReviewController = asyncHandler(async(req, res, next) => {
    // add order to req body
    req.body.vendor = req.params.vendorId;
    // req.body.user = req.user.id

    //check if order exist 
    const vendors = await User.findById(req.params.vendorId);
    if (!vendors) {
        return next(new ErrorResponse('there is no vendor with that Id', 404));
    };
    // console.log(req.body);
    const reviews = await Review.create(req.body);
    console.log(reviews);

    return res.status(200).json({
        success: true,
        data: reviews
    });


});

// @desc      Get Reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/vendor/:vendorId/reviews
// @access    Public
const getReviewController = asyncHandler(async(req, res, next) => {
    if (req.params.vendorId) {
        const reviews = await Review.find({ vendor: vendorId });
        return res.status(200).json({
            success: true,
            data: reviews
        });
    } else {
        res.status(200).json(res.advanceResults);
    }
});

module.exports = {
    createReviewController,
    getReviewController
};