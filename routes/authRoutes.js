const express = require('express');
const router = express.Router();
const {register,login,verifyEmail,sendVerificationEmailToUser,logout,forgotPassword,resetPassword,updateUserInformation} = require('../controllers/authControllers');
const {authenticatedUser} = require('../middleware/authentication');

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/send-verify-email').post(authenticatedUser,sendVerificationEmailToUser)
router.route('/verify-email').get(verifyEmail)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').patch(resetPassword)
router.route('/update-user-information').patch(authenticatedUser,updateUserInformation)
router.route('/logout').get(authenticatedUser,logout)

module.exports = router