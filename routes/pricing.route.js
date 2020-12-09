const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');


//Load controllers
const { createPricingController, getAllPricingController, getPricingController, updatePricingController, deletePricingController } = require('../controllers/pricingController');

router.route('/')
    .post(createPricingController)
    .get(
        getAllPricingController);

router.route('/:id')
    .get(getPricingController)
    .put(updatePricingController)
    .delete(deletePricingController);



module.exports = router;