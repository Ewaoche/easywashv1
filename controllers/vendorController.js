const User = require('../models/User');
const Pricing = require('../models/Pricing');


const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');







const getVendorsController = asyncHandler(async(req, res, next) => {


    // const vendors = await User.find({ geometry: { $near: { $geometry: { type: "Point", coordinates: [7, 13.3456] } } } });

    const vendors = await User.find({ role: 'vendor' });


    if (!vendors) {
        return next(new ErrorResponse('sorry there is no vendor with such adress', 404));
    }
    res.status(200).json({
        sucess: true,
        data: vendors,
        number: vendors.length
    });

});














// //@desc   Add pricing
// //@route POST /api/v1/dashboard/pricing
// // @Access Private/Vendor
// const createPricingController = asyncHandler(async(req, res, next) => {
//     const { itemName, description, estimatedTime, price } = req.body;

//     //create price
//     const pricing = await Pricing.create({
//         itemName,
//         description,
//         estimatedTime,
//         price
//     });
//     res.status(200).json({
//         success: true,
//         data: pricing
//     });


// });

// //@desc   GET All pricing
// //@route GET /api/v1/dashboard/pricing
// // @Access Private/Vendor

// const getAllPricingController = asyncHandler(async(req, res, next) => {
//     let pricing = await Pricing.find();
//     if (!pricing) {
//         return next(new ErrorResponse('there is no pricing with the id', 404));
//     };

//     res.status(200).json({
//         success: true,
//         data: pricing
//     });

// });

// //@desc   GET Single pricing
// //@route GET /api/v1/dashboard/pricing/:id
// // @Access Private/Vendor

// const getPricingController = asyncHandler(async(req, res, next) => {
//     let pricing = await Pricing.findById(req.params.id);
//     if (!pricing) {
//         return next(new ErrorResponse('there is no pricing with the id', 404));
//     };

//     res.status(200).json({
//         success: true,
//         data: pricing
//     });

// });

// //@desc   Update  pricing
// //@route PUT /api/v1/dashboard/pricing/:id
// // @Access Private/Vendor
// const updatePricingController = asyncHandler(async(req, res, next) => {
//     const pricing = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

//     res.status(201).json({
//         success: true,
//         data: pricing
//     });
// });


// //@desc   Delete  pricing
// //@route DELETE /api/v1/dashboard/pricing/:id
// // @Access Private/Vendor
// const deletePricingController = asyncHandler(async(req, res, next) => {
//     await Pricing.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//         success: true,
//         data: {}
//     });
// });


module.exports = {
    getVendorsController,

    // getAllPricingController,
    // createPricingController,
    // getPricingController,
    // updatePricingController,
    // deletePricingController
};