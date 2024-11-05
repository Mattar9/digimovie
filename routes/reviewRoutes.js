const express = require('express');
const {authenticatedUser,authorizePermission} = require('../middleware/authentication');
const router = express.Router();

const {createReview,getAllUserReviews,getReview,replyReview,deleteReview,positiveRateReview,negativeRateReview} = require('../controllers/reviewControllers');

router.route('/').get(authenticatedUser,getAllUserReviews).post(authenticatedUser,createReview)
router.route('/reply-Review').post(authenticatedUser,replyReview)
router.route('/positive-rate').post(authenticatedUser,positiveRateReview)
router.route('/negative-rate').post(authenticatedUser,negativeRateReview)
router.route('/:id').get(authenticatedUser,getReview).delete(authenticatedUser,authorizePermission('admin'),deleteReview)

module.exports = router;