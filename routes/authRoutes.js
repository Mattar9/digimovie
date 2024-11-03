const express = require('express');
const router = express.Router();
const {register,login,verifyEmail,sendVerificationEmailToUser,logout} = require('../controllers/authControllers');
const {authenticatedUser,authorizePermission} = require('../middleware/authentication');

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/send-verify-email').post(authenticatedUser,sendVerificationEmailToUser)
router.route('/verify-email').get(verifyEmail)
router.route('/logout').get(authenticatedUser,logout)

module.exports = router