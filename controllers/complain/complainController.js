// const Complain = require('../../models/Complain');
const ComplainRepository = require('./ComplainRepository');
const User = require('../../models/User');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const Order = require('../../models/Order');



const createComplainController = asyncHandler(async(req, res, next) => {

    req.body.user = req.user.id;
    req.body.orderId = req.params.orderId;
    // req.body.complain = req.body.complain;
    // console.log(req.body.complain, req.params.orderId);
    // if (!req.body.complain || !req.params.orderId) {
    //     return next(new ErrorResponse('order or complain must not be empty', 400));
    // };
    const orders = await Order.findById(req.params.orderId);
    if (!orders) {
        return next(new ErrorResponse(`No order with an Id of ${req.params.orderId}`, 404));

    }


    const complains = await ComplainRepository.create(req.body);

    if (!complain) {
        return next(new ErrorResponse('error occured trying to make complain try again', 500));

    }
    return res.status(200).json({
        status: 'success',
        message: ' complain created successfully',
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
        query = ComplainRepository.find({ orderId: req.params.orderId });

    } else {
        query = ComplainRepository.find();
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