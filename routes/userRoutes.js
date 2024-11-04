const express = require('express');
const {favoriteMovie,movieList} = require('../controllers/userController')
const {authenticatedUser,authorizePermission} = require('../middleware/authentication');
const router = express.Router();

router.route('/favorite').post(authenticatedUser,favoriteMovie)
router.route('/create-list').post(authenticatedUser,movieList)

module.exports = router