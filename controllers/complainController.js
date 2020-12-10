const Complain = require('../models/Complain');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Order = require('../models/Order');



const createComplainController = asyncHandler(async(req, res, next) => {

    req.body.user = req.user.id;

    if (!req.body.complain || !req.body.orderId) {
        return next(new ErrorResponse('order or complain must not be empty', 400));
    };
    const orders = await Order.findById(req.body.orderId);
    if (!orders) {
        return next(new ErrorResponse(`No order with an Id of ${req.body.orderId}`, 404));

    }


    const complains = await Complain.create(req.body);

    if (!complain) {
        return next(new ErrorResponse('error occured trying to make complain try again', 500));

    }
    return res.status(200).json({
        sucess: true,
        data: complains


    });



});


// @desc      Get complains
// @route     GET /api/v1/complains
// @route     GET /api/v1/order/:orderId/complains
// @access    Public
const getComplainsController = asyncHandler(async(req, res, next) => {
    let query;
    if (req.params.orderId) {
        query = Complain.find({ orderId: req.params.orderId });

    } else {
        query = Complain.find();
    }
    const complains = await query;
    if (!complains) {
        return next(new ErrorResponse('there is no complain yet', 404));
    }

    return res.status(200).json({
        success: true,
        data: complains
    });

});

module.exports = {
    createComplainController,
    getComplainsController
};