const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const sendEmail = require('../services/sendEmail');
const jwt = require('jsonwebtoken');




//@desc   Register users
//route POST /api/v1/auth/register
// Access Public

const registerController = asyncHandler(async(req, res, next) => {
    const { name, email, password, role } = req.body;

    // Validate submited data
    if (!name || !email || !password || !role) {
        return next(new ErrorResponse('Please provide an email, name, role  and password', 400));
    }

    // Check for user
    let user = await User.findOne({ email }).select('+password');
    if (user) {
        return next(new ErrorResponse('please this email already exist', 401));
    }

    //Create activation token
    const activationToken = jwt.sign({ name, email, password, role }, process.env.ACTIVE_SECRET, { expiresIn: process.env.ACTIVE_SECRET_EXPIRE });
    const message = `
    <h1>Please use the following to activate your account</h1>
    <a>${req.protocol}://${req.get('host')}/api/v1/auth/activation/${activationToken}</a>
    <p>This email may contain sensetive information</p>,
    <p>Best regards!</p>`;


    // Call sendEmail from utill
    try {
        await sendEmail({
            email: email,
            subject: 'Account activation link',
            message: message
        });
        // console.log(message);
        res.status(200).json({
            success: true,
            data: `Email has been Sent to ${email} `
        });
    } catch (err) {


        return next(new ErrorResponse('oop! Account activation link could not be sent', 500))

    };

});


//@desc   Login users
//route POST /api/v1/auth/login
// Access Public

const loginController = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    // Validate emil & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user
        });
};


//@desc   Activate  users 
//route POST /api/v1/auth/activation
// Access Public
const activationController = asyncHandler(async(req, res, next) => {

    const { activationToken } = req.body;

    if (!activationToken) {
        return next(new ErrorResponse('Invalid Invalid Token', 401));

    }
    const activation = jwt.verify(activationToken, process.env.ACTIVE_SECRET);

    const { name, email, password, role } = activation;


    // Create user
    user = await User.create({
        name,
        email,
        password,
        role
    });
    res.status(200).json({
        success: true,
        message: 'You are successfully registered',
        data: user
    });

    // sendTokenResponse(user, 200, res);

});


//@desc  LogOut users // clear cookies
//@route POST /api/v1/auth/logout
//@Access Private

const logoutController = asyncHandler(async(req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date.now() + 10 * 1000,
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        data: "successfully logout!"
    });
});

//@desc  Forgot Password
//route POST /api/v1/auth/forgotpassword
// Access Public

const forgotPasswordController = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorResponse('There is no user with this email !', 404))
    }

    //Get reset token from User model
    const resetToken = user.getResetPasswordToken();
    // console.log(resetToken);


    // include hash password and hashed pass expired into DB since it called on Schema
    await user.save({ validateBeforeSave: true });

    //Create reset Url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are receiving this message because you (or someone ) made a request for reset poassword
             Please make a put request to : \n\n ${resetUrl}`;

    // Call sendEmail from utill
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset',
            message: message
        });
        res.status(200).json({
            success: true,
            data: `Password reset Email link has been sent to ${email}`
        });
    } catch (err) {
        // console.log(err);
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('oop! Password reset Email could not be sent', 500))

    }
    res.status(200).json({
        success: true,
        data: user
    });
});


//@desc  Reset Password
//route PUT /api/v1/auth/resetpassword/:resettoken
// Access Public

const resetPasswordController = asyncHandler(async(req, res, next) => {
    //Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    };

    //Set new Password from the user
    user.password = req.body.password;
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);

});


//@desc  Get Current Loggedin users
//route POST /api/v1/auth/me
// Access Private

const getMeController = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
});



module.exports = {
    registerController,
    loginController,
    forgotPasswordController,
    activationController,
    resetPasswordController,
    logoutController,
    getMeController

};