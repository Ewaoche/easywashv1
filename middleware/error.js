const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
    let error = {...err }

    error.message = err.message;
    //log to the console for dev
    console.log(err);

    //Mongoose bad ObjectId Error (CastError)
    if (err.name === 'CastError') {
        const message = `Resource not found `;
        error = new ErrorResponse(message, 404);
    }

    //Token Expire
    if (err.name === 'TokenExpiredError') {
        const message = `You took so much time and the activation link has expired.Please Signup again !`;
        error = new ErrorResponse(message);
    }
    // Mongoose duplicate key Error
    if (err.code === 11000) {
        const message = 'Duplicate field value  Entered';
        error = new ErrorResponse(message, 400);

    }

    //Mongoose Validation Error
    if (err.name === 'ValidatorError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }


    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });

}

module.exports = errorHandler;