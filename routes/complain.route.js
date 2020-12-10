const express = require('express');


const router = express.Router({ mergeParams: true });

//Load  complain controller

const { createComplainController, getComplainsController } = require('../controllers/complainController');


// router.post('/complains', createComplainController);
// router.get('/complains', getComplainsController);


//advance result middleware
const Complain = require('../models/Complain');
const advanceResult = require('../middleware/advancedResult');

//protect route
const { protect, authorize } = require('../middleware/auth');


router.route('/')
    .get(getComplainsController)
    .post(protect, createComplainController);


module.exports = router;