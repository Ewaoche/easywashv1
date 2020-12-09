const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

//Load vendor controllers
const {
    getVendorsController
} = require('../controllers/vendorController');


//Include other routes
const reviewRoute = require('./review.route');
const pricingRoute = require('./pricing.route');

//redirect review route
router.use('/:vendorId/reviews', reviewRoute);
router.use('/:vendorId/prices', pricingRoute);


//VENDOR ROUTES
router.get('/getAllvendors', getVendorsController);


module.exports = router;