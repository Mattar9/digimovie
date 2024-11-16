const customError = require('../errors');
const {StatusCodes} = require('http-status-codes')
const User = require('../models/User');
const Movie = require('../models/Movie');
const List = require('../models/List');
const Rate = require('../models/Rate');
const Review = require('../models/Review')
const RequestMovie = require('../models/RequestMovie')

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
    res.status(StatusCodes.OK).json({success: true, count: user.length, lists: lists})
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

const updateList = async (req, res) => {
    const {userId} = req.user
    const {id} = req.params

    const list = await List.findOneAndUpdate({_id: id, user: userId}, req.body)
    if (!list) {
        throw new customError.NotFoundError('there is no list with this id')
    }
    res.status(StatusCodes.OK).json({success: true, data: list})
}

const getSingleList = async (req, res) => {
    const {id} = req.params
    const list = await List.findOne({_id: id})
    if (!list) {
        throw new customError.NotFoundError('there is no list with this id')
    }
    res.status(StatusCodes.OK).json({success: true, data: list})
}

const deleteList = async (req, res) => {
    const {id} = req.body
    const list = await List.findOneAndDelete({_id: id})
    if (!list) {
        throw new customError.NotFoundError('there is no list with this id')
    }
    res.status(StatusCodes.OK).json({success: true, msg: 'list deleted'})
}

const getAllUserReview = async (req, res) => {
    const {userId} = req.body
    if (!userId) {
        throw new customError.BadRequestError('please enter user id')
    }
    const review = await Review.find({user: userId})
    res.status(StatusCodes.OK).json({success: true, count: review.length, data: review})
}

const getAllUserRate = async (req, res) => {
    const {userId} = req.body
    if (!userId) {
        throw new customError.BadRequestError('please enter user id')
    }
    const rateMovie = await Rate.find({user: userId})
    res.status(StatusCodes.OK).json({success: true, count: rateMovie.length, data: rateMovie})
}

const createRequestMovie = async (req, res) => {
    const {userId} = req.user
    const {title, releaseYear, type} = req.body
    if (!title || !releaseYear) {
        throw new customError.BadRequestError('please enter title and releaseYear')
    }
    const requestMovie = await RequestMovie.create({user: userId, title, releaseYear, type})
    res.status(StatusCodes.CREATED).json({success: true, data: requestMovie})
}

const getAllRequestedMovies = async (req, res) => {
    const requestedMovies = await RequestMovie.find()
    res.status(StatusCodes.OK).json({success: true, count: requestedMovies.length, data: requestedMovies})
}

const handleRequestMovie = async (req, res) => {
    const {movieId} = req.body
    if (!movieId) {
        throw new customError.BadRequestError('please enter a movie id')
    }
    const movie = await RequestMovie.findOne({_id: movieId})
    if (!movie){
        throw new customError.NotFoundError('there is no movie with this id')
    }
    await RequestMovie.deleteOne(movie)
    res.status(StatusCodes.OK).json({success: true, msg: 'requested movie is available'})
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
    res.status(StatusCodes.CREATED).json({success: true, data: user})
}

module.exports = {
    favoriteMovie,
    movieList,
    rateMovie,
    getAllFavoriteMovie,
    getAllUserList,
    getAllUserReview,
    getAllUserRate,
    updateList,
    getSingleList,
    deleteList,
    createRequestMovie,
    getAllRequestedMovies,
    handleRequestMovie
}