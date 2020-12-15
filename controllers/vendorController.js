const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');



const getVendorsController = asyncHandler(async(req, res, next) => {


    // const vendors = await User.find({ geometry: { $near: { $geometry: { type: "Point", coordinates: [7, 13.3456] } } } });

    const vendors = await User.find({ role: 'vendor', "isVerify": "true" }, { "location": 0 });


    if (!vendors) {
        return next(new ErrorResponse('sorry there is no vendor with such adress', 404));
    }
    res.status(200).json({
        sucess: true,
        data: vendors,
        number: vendors.length
    });

});



module.exports = {
    getVendorsController

};