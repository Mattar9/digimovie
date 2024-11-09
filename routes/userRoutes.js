const express = require('express');
const {favoriteMovie,movieList,rateMovie,getAllFavoriteMovie,getAllUserList,getAllUserReview} = require('../controllers/userController')
const {authenticatedUser,authorizePermission} = require('../middleware/authentication');
const router = express.Router();

router.route('/favorite').post(authenticatedUser,favoriteMovie).get(getAllFavoriteMovie);
router.route('/list').post(authenticatedUser,movieList).get(getAllUserList)
router.route('/reviews').get(getAllUserReview)
router.route('/rate-movie').post(authenticatedUser,rateMovie)

module.exports = router