const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');


//Load controllers
const { createPricingController, getAllPricingController, getPricingController, updatePricingController, deletePricingController } = require('../controllers/pricing/pricingController');

router.route('/')
    .post(protect, createPricingController)
    .get(getAllPricingController);


router.route('/:id')
    .get(getPricingController)
    .put(protect, updatePricingController)
    .delete(protect, deletePricingController);



module.exports = router;