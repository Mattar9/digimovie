const customError = require('../errors');
const User = require('../models/User');
const {StatusCodes} = require('http-status-codes')
const {attachCookiesToResponse} = require('../utils/jwt')
const createTokenUser = require('../utils/createTokenUser')
const sendVerificationEmail = require('../utils/sendVerificationEmail')
const crypto = require('crypto');

const register = async (req, res) => {
    const {email, password, password_confirmation, name} = req.body;
    if (!email || !password || !password_confirmation || !name) {
        throw new customError.BadRequestError('please enter email,password and name');
    }
    if (password !== password_confirmation) {
        throw new customError.BadRequestError('password_confirmation should be the same as the password');
    }
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const verificationToken = await crypto.randomBytes(40).toString('hex');

    const user = await User.create({name, email, password, password_confirmation, role, verificationToken});

    const payload = createTokenUser(user)
    attachCookiesToResponse(res, payload)
    res.status(StatusCodes.CREATED).json({success: true, data: user})
}

const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new customError.BadRequestError('please enter email and password');
    }
    const user = await User.findOne({email});
    if (!user) {
        throw new customError.NotFoundError('there is no user with this email');
    }

    const isCorrectPassword = await user.correctPassword(password, user.password)

    if (!isCorrectPassword) {
        throw new customError.UnauthenticatedError('password is wrong')
    }
    user.lastAction = Date.now();
    await user.save({validateBeforeSave: false});

    const payload = createTokenUser(user)
    attachCookiesToResponse(res, payload)
    res.status(StatusCodes.OK).json({success: true, data: user})
}

const sendVerificationEmailToUser = async (req, res) => {
    const origin = `http://localhost:5000/api/v1`
    const {userId} = req.user
    const user = await User.findOne({_id: userId})

    await sendVerificationEmail({
        name: user.name,
        email: user.email,
        verificationToken: user.verificationToken,
        origin
    })

    res.status(StatusCodes.OK).json({
        msg: 'Success! please check your email to verify account',
        verificationToken: user.verificationToken
    });
}

// without frontend
const verifyEmail = async (req, res) => {
    const {email, token} = req.query

    const user = await User.findOne({email})
    if (!user) {
        throw new customError.UnauthenticatedError('there is user with this email');
    }
    if (user.verificationToken !== token) {
        throw new customError.UnauthenticatedError('verificationToken is invalid');
    }

    user.isVerified = true
    user.verified = Date.now()
    user.verificationToken = ''
    user.validateBeforeSave = false

    await user.save({validateBeforeSave: false});

    res.status(StatusCodes.OK).json({msg: 'Email Verified'})
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({msg: 'user logged out!'});
}

module.exports = {register, login, sendVerificationEmailToUser, verifyEmail, logout}