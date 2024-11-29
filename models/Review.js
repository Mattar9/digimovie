const mongoose = require('mongoose');
const Movie = require('../models/Movie');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review is required'],
        trim: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    movie: {
        type: mongoose.Schema.ObjectId,
        ref: 'Movie',
        required: [true, 'review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to a user']
    },
    spoilReview: {
        type: Boolean,
        default: false
    },
    positiveRate: {
        type: Number,
        default: 0
    },
    negativeRate: {
        type: Number,
        default: 0
    },
    repliedReviewTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
    },
    repliedReviewFrom: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Review',
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

reviewSchema.pre('save', async function (next) {
    const movieId = this.movie
    const movie = await Movie.findById(movieId)
    movie.num_of_review++
    await movie.save({validateBeforeSave: false});
    next()
})

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'movie',
        select: 'title type genre'
    });
    next();
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'repliedReviewFrom',
        select: 'review'
    });
    next();
});

module.exports = mongoose.model('Review', reviewSchema);