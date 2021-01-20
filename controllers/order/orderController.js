const asyncHandler = require('../../middleware/async');
// const Order = require('../../models/Order');
const OrderRepository = require('../../controllers/order/OrderRepository');
const PricingRepository = require('../../controllers/pricing/PricingRepository');
// const Pricing = require('../../models/Pricing');
const ErrorResponse = require('../../utils/errorResponse');

const createOrderController = asyncHandler(async(req, res, next) => {

    const pricings = await PricingRepository.find({ _id: req.body.pricing });

    if (!pricings) {
        return next(new ErrorResponse('pricings can not be empty !', 400));
    };

    req.body.pricing = req.body.pricing;
    req.body.user = req.user.id;

    orders = await OrderRepository.create(req.body);

    res.status(201).json({
        status: 'success',
        message: ' order created successfully',
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
        query = OrderRepository.find({ user: req.params.userId }).populate('pricing');

    } else {
        query = OrderRepository.find().populate('pricing');
    }
    const orders = await query;
    if (!orders) {
        return next(new ErrorResponse('there is no order yet', 404));

    }
    res.status(200).json({
        status: 'success',
        message: ' Available orders',
        data: orders
    });
});


const updateOrderController = asyncHandler(async(req, res, next) => {

});

module.exports = {
    createOrderController,
    getOrderController
};