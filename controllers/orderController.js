const asyncHandler = require('../middleware/async');
const Order = require('../models/Order');
const { findById } = require('../models/Pricing');
const Pricing = require('../models/Pricing');
const ErrorResponse = require('../utils/errorResponse');

const createOrderController = asyncHandler(async(req, res, next) => {

    const pricings = await Pricing.find({ _id: req.body.pricing });

    if (!pricings) {
        return next(new ErrorResponse('pricings can not be empty !', 400));
    };

    req.body.pricing = req.body.pricing;
    req.body.user = req.body.user;

    orders = await Order.create(req.body);

    res.status(201).json({
        success: true,
        data: orders
    });

});

// @desc      Get order
// @route     GET /api/v1/order
// @route     GET /api/v1/auth/:userId/order
// @access    private
const getOrderController = asyncHandler(async(req, res, next) => {
    let query;
    // console.log(req.params.userId);
    if (req.params.userId) {
        query = Order.find({ user: req.params.userId });

    } else {
        query = Order.find();
    }
    const orders = await query;
    if (!orders) {
        return next(new ErrorResponse('there is no order yet', 404));

    }
    res.status(200).json({
        success: true,
        data: orders
    });
});

module.exports = {
    createOrderController,
    getOrderController
};