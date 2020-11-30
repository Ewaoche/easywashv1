const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/auth');

//Load Controller
const { registerController, loginController, activationController, resendactivetokenController, getMeController, forgotPasswordController, resetPasswordController } =
require('../controllers/authController');


router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', protect, getMeController);
router.post('/activation', activationController);
router.post('/resendactivetoken', resendactivetokenController);
router.post('/forgotpassword', forgotPasswordController);
router.put('/resetpassword/:resettoken', resetPasswordController);



module.exports = router;