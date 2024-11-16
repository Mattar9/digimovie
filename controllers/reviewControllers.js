const customError = require('../errors');
const {StatusCodes} = require('http-status-codes')
const Movie = require('../models/Movie');
const Review = require('../models/Review');

const getAllUserReviews = async (req, res) => {
    const {userId} = req.user
    const review = await Review.find({user: userId})
    res.status(StatusCodes.OK).json({success: true,count:review.length, data: review})
}

const createReview = async (req, res) => {
    const {review: movieReview, movie: movieId} = req.body
    const {userId} = req.user
    if (!movieReview || !movieId) {
        throw new customError.BadRequestError('please enter all required fields');
    }
    const movie = await Movie.findOne({_id: movieId})
    if (!movie) {
        throw new customError.BadRequestError('there no movie with this id');
    }
    const review = await Review.create({user: userId, ...req.body})
    res.status(StatusCodes.CREATED).json({success: true, data: review})
}

const getReview = async (req, res) => {
    const {id} = req.params
    const review = await Review.findOne({_id: id})
    if (!review) {
        throw new customError.BadRequestError('there is no review with this id');
    }
    res.status(StatusCodes.OK).json({success: true, data: review})
}

const deleteReview = async (req, res) => {
    const {id} = req.params
    const review = await Review.findOneAndDelete({_id: id})
    res.status(StatusCodes.OK).json({success: true, msg: 'deleted review successfully'})
}

const replyReview = async (req, res) => {
    const {userId} = req.user
    const {review: movieReview, movie: movieId, repliedReviewTo: repliedReviewId} = req.body
    if (!movieReview || !movieId || !repliedReviewId) {
        throw new customError.BadRequestError('please enter all required fields');
    }
    const movie = await Movie.findOne({_id: movieId})
    if (!movie) {
        throw new customError.BadRequestError('there no movie with this id');
    }
    const review = await Review.findOne({_id: repliedReviewId})
    if (!review) {
        throw new customError.BadRequestError('there is no review with this id');
    }
    const replyReview = await Review.create({user: userId, ...req.body})

    review.repliedReviewFrom.push(replyReview._id)
    replyReview.repliedReviewTo = review._id

    await review.save({validateBeforeSave: false});
    res.status(StatusCodes.OK).json({success: true, data: review, replyReview})
}

const positiveRateReview = async (req, res) => {
    const {reviewId} = req.body
    if (!reviewId) {
        throw new customError.BadRequestError('please enter review id');
    }
    const review = await Review.findOne({_id:reviewId})
    if (!review) {
        throw new customError.BadRequestError('there is no review with this id');
    }
    review.positiveRate++
    await review.save({validateBeforeSave: false});
    res.status(StatusCodes.OK).json({success: true, data: review})
}

const negativeRateReview = async (req, res) => {
    const {reviewId} = req.body
    if (!reviewId) {
        throw new customError.BadRequestError('please enter review id');
    }
    const review = await Review.findOne({_id:reviewId})
    if (!review) {
        throw new customError.BadRequestError('there is no review with this id');
    }
    review.negativeRate--
    await review.save({validateBeforeSave: false});
    res.status(StatusCodes.OK).json({success: true, data: review})
}

module.exports = {getAllUserReviews, createReview, getReview, replyReview, deleteReview,positiveRateReview,negativeRateReview}