const customError = require('../errors');
const Movie = require('../models/Movie');
const {StatusCodes} = require('http-status-codes')

const createMovie = async (req, res) => {
    const {title, year, director, genre, cast, duration, country, age_group} = req.body
    if (!title || !year || !director || !genre  || !cast || !duration || !country || !age_group) {
        throw new customError.BadRequestError('please enter all required fields');
    }
    const movie = await Movie.create(req.body)
    res.status(StatusCodes.CREATED).json({success: true,data: movie})
}

const getMovie = async (req, res) => {
    const {id} = req.params
    const movie = await Movie.findById(id).populate({ path: 'reviews' });
    res.status(StatusCodes.OK).json({success: true, data: movie})
}

const getAllMovies = async (req, res) => {
    const movies = await Movie.find()
    res.status(StatusCodes.OK).json({success: true,count:movies.length, data: movies})
}

module.exports = {createMovie,getAllMovies,getMovie}