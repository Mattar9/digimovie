const customError = require('../errors');
const {StatusCodes} = require('http-status-codes')
const User = require('../models/User');
const Movie = require('../models/Movie');
const List = require('../models/List');
const Rate = require('../models/Rate');
const Review = require('../models/Review')

const favoriteMovie = async (req, res) => {
    const {userId} = req.user
    const {id: movieId} = req.body
    if (!movieId) {
        throw new customError.BadRequestError('please enter movie id')
    }
    const movie = await Movie.findOne({_id: movieId})
    if (!movie) {
        throw new customError.BadRequestError('there is no movie with this id')
    }
    const user = await User.findOne({_id: userId})
    user.favouritesMovie.push(movieId)
    await user.save({validateBeforeSave: false});
    res.status(StatusCodes.OK).json({success: true, msg: 'movie added to user favourite movies'})
}

const getAllFavoriteMovie = async (req, res) => {
    const {userId} = req.body
    if (!userId) {
        throw new customError.BadRequestError('please enter user id')
    }
    const user = await User.findOne({_id: userId})
    res.status(StatusCodes.OK).json({success: true, favoriteMovie: user.favouritesMovie})
}

const getAllUserList = async (req, res) => {
    const {userId} = req.body
    if (!userId) {
        throw new customError.BadRequestError('please enter user id')
    }
    const lists = await List.find({user: userId})
    res.status(StatusCodes.OK).json({success: true, lists: lists})
}

const movieList = async (req, res) => {
    const {title, listType, listItem} = req.body
    const {userId} = req.user
    if (!title || !listType || !listItem) {
        throw new customError.BadRequestError('please enter all required field')
    }
    const user = await User.findOne({_id: userId})
    if (!user) {
        throw new customError.BadRequestError('there is no user with this id')
    }
    const list = await List.create({user: userId, ...req.body})
    const listId = list._id
    user.listItems.push(listId)
    await user.save({validateBeforeSave: false});
    res.status(StatusCodes.CREATED).json({success: true, data: list})
}

const getAllUserReview =async (req, res) => {
    const {userId} = req.body
    if (!userId) {
        throw new customError.BadRequestError('please enter user id')
    }
    const review = await Review.find({user:userId})
    res.status(StatusCodes.OK).json({success:true,data:review})
}

const rateMovie = async (req, res) => {
    const {userId} = req.user
    const {movieId, rate} = req.body
    if (!movieId || !rate) {
        throw new customError.BadRequestError('please enter movie id and rate')
    }
    const user = await User.findOne({_id: userId})
    user.rateMovies.push({movie: movieId, rate: rate})
    await user.save({validateBeforeSave: false});
    await Rate.create({rating: rate, movie: movieId, user: userId})
    res.status(StatusCodes.OK).json({success: true, data: user})
}

module.exports = {favoriteMovie, movieList, rateMovie, getAllFavoriteMovie, getAllUserList,getAllUserReview}