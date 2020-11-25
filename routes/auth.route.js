const express = require('express');

const router = express.Router();

//Load Controller
const { registerController, loginController, activationController, getMeController, forgotPasswordController, resetPasswordController } =
require('../controllers/authController');


router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', getMeController);
router.post('/activation', activationController);
router.post('/forgotpassword', forgotPasswordController);
router.put('/resetpassword/:resettoken', resetPasswordController);



module.exports = router;