const Complain = require('../models/Complain');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');



const complainController = asyncHandler(async(req, res, next) => {
    const { complain, order, user } = req.body;

    if (!complain || !order) {
        return next(new ErrorResponse('order or complain must not be empty', 400));
    };
    let complains = new Complain({
        complain,
        order,
        user
    });

    complains = await complains.save();

    if (!complain) {
        return next(new ErrorResponse('error occured trying to make complain try again', 500));

    }
    return res.status(200).json({
        sucess: true,
        data: complains


    });



});


const getComplainsController = asyncHandler(async(req, res, next) => {
    const complains = await Complain.find();
    if (!complains) {
        return next(new ErrorResponse('there is no complain yet', 404));

    }
    res.status(200).json({
        sucess: true,
        data: complains
    });
});

module.exports = {
    complainController,
    getComplainsController
};