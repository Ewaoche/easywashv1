 const express = require('express')
 const { protect } = require('../middleware/auth');
 const router = express.Router({ mergeParams: true });

 //advance result middleware
 const Review = require('../models/Review');
 const advanceResults = require('../middleware/advancedResult');

 //Load controller
 const { createReviewController, getReviewController } = require('../controllers/reviewController');

 router.route('/').get(advanceResults(Review, {
     path: 'vendor',
     select: 'name'
 }), getReviewController).post(protect, createReviewController);

 module.exports = router;