const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')

const rateSchema = new mongoose.Schema({
    movie: {type: mongoose.Schema.ObjectId, required: true},
    rate: {type: Number, required: true, min: 1, max: 5},
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide a name'],
        unique: [true, 'please provide a unique name'],
        minlength: 3,
        maxlength: 25
    },
    email: {
        type: String,
        required: [true, 'please provide an email'],
        unique: [true, 'your email must be unique'],
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    phoneNumber:{
      type: Number,
      required: [true, 'please provide a phone number'],
      trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    password_confirmation: {
        type: String,
        required: [true, 'Password must be confirmed'],
        validate: function (el) {
            // this only works on save() and create() method
            return el === this.password;
        },
        message: 'password_confirmation should be the same as the password'
    },
    aboutUser: {
        type: String,
        maxLength: 100
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    favouritesMovie: {
        type: [mongoose.Types.ObjectId],
        ref: 'Movie',
    },
    listItems: {
        type: [mongoose.Types.ObjectId],
        ref: 'List',
    },
    rateMovies: {
        type: [rateSchema],
    },
    Membership: {
        type: Date,
        default: Date.now()
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verified: Date,
    lastAction: {
        type: Date,
        default: Date.now()
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.password_confirmation = undefined;
    next();
});

UserSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}

module.exports = mongoose.model('User', UserSchema);