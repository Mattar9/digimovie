const customError = require('../errors');
const {StatusCodes} = require('http-status-codes')
const User = require('../models/User');
const Movie = require('../models/Movie');
const List = require('../models/List');
const Rate = require('../models/Rate');

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
    const list = await List.create(req.body)
    const listId = list._id
    user.listItems.push(listId)
    await user.save({validateBeforeSave: false});
    res.status(StatusCodes.CREATED).json({success: true, data: list})
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

module.exports = {favoriteMovie, movieList, rateMovie}