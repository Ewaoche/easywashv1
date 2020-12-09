const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');


//Load order controllers 
const { createOrderController, getOrderController } = require('../controllers/orderController');


//Redirect complain route
const complainRoute = require('./complain.route');
router.use('/:orderId/complains', complainRoute);


router.route('/').post(createOrderController)
    .get(getOrderController);



module.exports = router;