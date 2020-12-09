 const express = require('express')

 const router = express.Router({ mergeParams: true });

 //advance result middleware
 const Review = require('../models/Review');
 const advanceResults = require('../middleware/advancedResult');

 //Load controller
 const { createReviewController, getReviewController } = require('../controllers/reviewController');

 router.route('/').get(advanceResults(Review, {
     path: 'vendor',
     select: 'name'
 }), getReviewController).post(createReviewController);

 module.exports = router;