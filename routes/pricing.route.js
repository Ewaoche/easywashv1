const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');


//Load controllers
const { createPricingController, getAllPricingController, getPricingController, updatePricingController, deletePricingController } = require('../controllers/pricingController');

protect
router.route('/')
    .post(createPricingController)
    .get(getAllPricingController);

router.route('/:id')
    .get(getPricingController)
    .put(updatePricingController)
    .delete(deletePricingController);



module.exports = router;