const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Pricing = require('../models/Pricing');
const User = require('../models/User');


// @desc      Add review
// @route     POST /api/v1/vendor/:vendorId/prices
// @access    Private
const createPricingController = asyncHandler(async(req, res, next) => {
    const { itemName, description, estimatedTime, price, priceTotal } = req.body;
    const vendor = req.params.vendorId;
    // req.body.vendorId = req.params.vendorId;

    const vendors = await User.findById(req.params.vendorId);
    if (!vendors) {
        return next(new ErrorResponse(`there is no such vendor with the id ${vendorId}`, 404));
    }

    const pricing = await Pricing.create({
        itemName,
        description,
        estimatedTime,
        price,
        priceTotal,
        vendor

    });
    res.status(201).json({
        success: true,
        data: pricing
    });


});

// @desc      Get Prices
// @route     GET /api/v1/pricing
// @route     GET /api/v1/vendor/:vendorId/pricing
// @access    Public

const getAllPricingController = asyncHandler(async(req, res, next) => {
    let query;
    if (req.params.vendorId) {
        query = Pricing.find({ vendor: req.params.vendorId });

    } else {
        query = Pricing.find();
    }
    const prices = await query;
    return res.status(200).json({
        success: true,
        data: prices
    });

});

//@desc   GET Single pricing
//@route GET /api/v1/dashboard/pricing/:id
// @Access Private/Vendor

const getPricingController = asyncHandler(async(req, res, next) => {
    let pricing = await Pricing.findById(req.params.id);
    if (!pricing) {
        return next(new ErrorResponse('there is no pricing with the id', 404));
    };

    res.status(200).json({
        success: true,
        data: pricing
    });

});

//@desc   Update  pricing
//@route PUT /api/v1/dashboard/pricing/:id
// @Access Private/Vendor
const updatePricingController = asyncHandler(async(req, res, next) => {
    const pricing = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
        success: true,
        data: pricing
    });
});


//@desc   Delete  pricing
//@route DELETE /api/v1/dashboard/pricing/:id
// @Access Private/Vendor
const deletePricingController = asyncHandler(async(req, res, next) => {
    await Pricing.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});

module.exports = {
    getAllPricingController,
    createPricingController,
    getPricingController,
    updatePricingController,
    deletePricingController
};