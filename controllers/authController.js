const path = require('path');
const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

// const url = 'https://jsonplaceholder.typicode.com/todos';
// const url = 'https://api.opencagedata.com/geocode/v1/json?key=42799ef0ae524b20bcc1d40c6df633f4&q=aa 11 nassarawa road nassarawa kaduna';


//@desc   Register users
//route POST /api/v1/auth/register
// Access Public

const registerController = asyncHandler(async(req, res, next) => {
    const { name, email, password, role, address, phone } = req.body;


    let user = await User.findOne({ email }).select('+password');
    if (user) {
        return next(new ErrorResponse('please this email already exist', 401));
    }

    const activationToken = jwt.sign({ name, email, password, role, address, phone }, process.env.ACTIVE_SECRET, { expiresIn: process.env.ACTIVE_SECRET_EXPIRE });
    const messages = `
    <h1>Please use the following to activate your account</h1>
    <a>${req.protocol}://${req.get('host')}/api/v1/auth/activation/${activationToken}</a>
    <p>This email may contain sensetive information</p>,
    <p>Best regards!</p>`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        },
    });

    const message = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Account activation link',
        text: messages
    };

    user = await User.create({
        name,
        email,
        password,
        role,
        address,
        phone

    });
    transporter.sendMail(message, function(err, success) {
        if (err) {
            return res.status(200).json({
                success: false,
                message: `Account activation could not be send to ${email}`

            });
        }
        if (success) {
            // Create Token 
            // const token = user.getSignedJwtToken();
            // const createdDate = user.getCreatedDate();
            return res.status(200).json({
                success: true,
                message: `Account activation link has been sent to ${email}`,
                data: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    address: user.address,
                    phone: user.phone
                }

            });
        }

    });




});

//@desc   Resend Verification Token 
//route POST /api/v1/auth/resendactivationtoken
// Access Public

const resendactivetokenController = asyncHandler(async(req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'please provide your email' });
    }
    const user = await User.findOne({ email });


    if (!user) {
        return res.status(400).json({ success: false, message: 'this email does not exist in the database' });

    }
    const { name, password, role } = user;
    if (user.isVerify) {
        return res.status(400).json({ success: false, message: 'Your account is already verified go to login' });
    }
    //Create activation token
    const activationToken = jwt.sign({ name, email, password, role }, process.env.ACTIVE_SECRET, { expiresIn: process.env.ACTIVE_SECRET_EXPIRE });
    const messages = `
     <h1>Please use the following to activate your account</h1>
     <a>${req.protocol}://${req.get('host')}/api/v1/auth/activation/${activationToken}</a>
     <p>This email may contain sensetive information</p>,
     <p>Best regards!</p>`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        },
    });

    const message = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Account activation link',
        text: messages
    };

    transporter.sendMail(message, function(err, success) {
        if (err) {
            return res.status(200).json({
                success: false,
                message: `Account activation could not be send to ${email}`,

            });
        }

    });

    res.status(200).json({
        status: 'success',
        message: `Account activation has been send to ${email} again !`
    });

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
    if (!user.isVerify) {
        return next(new ErrorResponse('Your account is not verify yet ', 401));

    }

    sendTokenResponse(user, 200, res);
});


//@desc   Activate  users 
//route POST /api/v1/auth/activation
// Access Public
const activationController = asyncHandler(async(req, res, next) => {

    const { activationToken } = req.body;

    if (!activationToken) {
        return next(new ErrorResponse('Invalid Invalid Token', 401));

    }
    const activation = jwt.verify(activationToken, process.env.ACTIVE_SECRET);

    const { email } = activation;
    let user = await User.findOne({ email }).select('+password');

    if (user.isVerify) {
        return res.status(400).json({ success: false, message: 'You already verified' });
    }

    // update user
    user.isVerify = true;
    user = await user.save();

    return res.status(200).json({
        status: success,
        message: 'Your account has been verify successfully ',
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

    });


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
        status: 'success',
        message: "successfully logout!"
    });
});

//@desc  Forgot Password
//route POST /api/v1/auth/forgotpassword
// Access Public

const forgotPasswordController = asyncHandler(async(req, res, next) => {
    const { email } = req.body;

    // Validate emil & password
    if (!email) {
        return next(new ErrorResponse('Please provide an email', 400));
    }

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

    const messages = `You are receiving this message because you (or someone ) made a request for reset poassword
             Please click on the link to reset your password : \n\n ${resetUrl}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        },
    });

    const message = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Reset Password link',
        text: messages
    };

    transporter.sendMail(message, function(err, success) {
        if (err) {
            // console.log(err);
            user.getResetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            user.save({ validateBeforeSave: false });

            return next(new ErrorResponse('oop! Password reset Email could not be sent', 500))
        } else {
            return res.status(200).json({
                success: true,
                message: `Password reset Email link has been sent to ${email}`
            });
        }

    })

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

//@desc  Update User Profile
//route PUT /api/v1/dashboard/profile
// Access Private

const updateProfileController = asyncHandler(async(req, res, next) => {
    let user = new User();
    const updatefield = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        profession: req.body.profession
    };
    // const filen = req.files;
    // console.log(filen);
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));

    }

    const file = req.files.file;

    //ensure the file is an image
    if (!file.mimetype.startsWith('image')) {
        return next(
            new ErrorResponse(`Please upload an image file`, 400)
        );
    }

    //Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`you try to upload an image file too large please it should not be greater than 1MG`, 400)
        );
    }

    //Create Custom file name
    file.name = `photo_${user._id}${path.parse(file.name).ext}`;
    // console.log(file.name);
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(
                new ErrorResponse(`oops Error occur trying to upload image`, 500)
            );
        } else {
            updatefield.image = file.name;
            await User.findByIdAndUpdate(req.params.id, updatefield);
            res.status(200).json({
                status: 'success',
                message: 'profile updated successfully',
                data: updatefield
            });
        }
    });

});


//@desc  Get Current Loggedin users
//route POST /api/v1/auth/me
// Access Private

const getMeController = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: 'success',
        message: 'Available users',
        data: user
    });
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
            status: 'success',
            token,
            user
        });
};

module.exports = {
    loginController,
    forgotPasswordController,
    activationController,
    resetPasswordController,
    logoutController,
    getMeController,
    registerController,
    resendactivetokenController,
    updateProfileController
};