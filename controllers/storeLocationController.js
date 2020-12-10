const StoreLocation = require('../models/StoreLocation');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');


//@ Create storelocation,
//@ Route POST /api/v1/location
//@ Access Private/Vendor

const createStorelocationController = asyncHandler(async(req, res, next) => {
    req.body.createdBy = req.user.id;

    const storelocation = await StoreLocation.create(req.body);

    res.status(200).json({
        success: true,
        data: storelocation
    });
});

//@ Get All storelocation,
//@ Route GET /api/v1/location
//@ Access Private/Vendor

const getAllstoreLocationController = asyncHandler(async(req, res, next) => {
    const storelocation = await StoreLocation.find();
    if (!storelocation) {
        return next(new ErrorResponse('oops! there is no stored addresses', 404))
    }
    res.status(200).json({
        success: true,
        data: storelocation
    });
});

//@ Get storelocation,
//@ Route GET /api/v1/location/:id
//@ Access Private/Vendor

const getstoreLocationController = asyncHandler(async(req, res, next) => {
    const storelocation = await StoreLocation.findById(req.params.id);
    if (!storelocation) {
        return next(new ErrorResponse('oops! there is no stored addresses', 404));
    }
    res.status(200).json({
        success: true,
        data: storelocation
    });
});
//@ Upadete storelocation,
//@ Route PUT /api/v1/location/:id
//@ Access Private/Vendor

const updatestoreLocationController = asyncHandler(async(req, res, next) => {
    const storelocation = await StoreLocation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!storelocation) {
        return next(new ErrorResponse('oops! there is no stored addresses', 404))
    }
    res.status(200).json({
        success: true,
        data: storelocation
    });
});


//@ Delete storelocation,
//@ Route DELETE /api/v1/location/:id
//@ Access Private/Vendor

const deletestoreLocationController = asyncHandler(async(req, res, next) => {
    await StoreLocation.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});

module.exports = {
    createStorelocationController,
    getAllstoreLocationController,
    getstoreLocationController,
    updatestoreLocationController,
    deletestoreLocationController
};