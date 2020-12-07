const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

//Load vendor controllers
const {
    getVendorsController,
    getAllPricingController,
    createPricingController,
    getPricingController,
    updatePricingController,
    deletePricingController




} = require('../controllers/vendorController');

//VENDOR ROUTES
router.get('/getAllvendors', getVendorsController);




//protect routes
// router.use(protect);

//VENDOR PRICESS ROUTES
router.route('/prices')
    .post(createPricingController)
    .get(getAllPricingController);

router.route('/prices/:id')
    .get(getPricingController)
    .put(updatePricingController)
    .delete(deletePricingController);

module.exports = router;