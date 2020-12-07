const express = require('express');

const router = express.Router();
const { protect } = require('../middleware/auth');

//Load controllers
const { createStorelocationController, getAllstoreLocationController, getstoreLocationController, deletestoreLocationController, updatestoreLocationController } = require('../controllers/storeLocationController');

//protect routes
// router.use(protect);
router.route('/')
    .post(createStorelocationController)
    .get(getAllstoreLocationController);

router.route('/:id')
    .get(getstoreLocationController)
    .put(updatestoreLocationController)
    .delete(deletestoreLocationController);

module.exports = router;