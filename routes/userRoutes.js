const express = require('express');
const {favoriteMovie,movieList,rateMovie} = require('../controllers/userController')
const {authenticatedUser,authorizePermission} = require('../middleware/authentication');
const router = express.Router();

router.route('/favorite').post(authenticatedUser,favoriteMovie)
router.route('/create-list').post(authenticatedUser,movieList)
router.route('/rate-movie').post(authenticatedUser,rateMovie)

module.exports = router