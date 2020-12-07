const asyncHandler = require('../middleware/async');
const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');

const createOrderController = asyncHandler(async(req, res, next) => {
    let orders = req.body;
    if (orders.orderItems.length === 0) {
        return next(new ErrorResponse('Order is empty !', 400));
    };

    orders = new Order({
        orderItems: orders.orderItems,
        user: req.body.user,

    });

    orders = await orders.save();

    res.status(201).json({
        success: true,
        data: orders
    });

});


module.exports = {
    createOrderController
};