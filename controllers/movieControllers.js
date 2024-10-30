const customError = require('../errors');
const Movie = require('../models/Movie');
const {StatusCodes} = require('http-status-codes')

const createMovie = async (req, res) => {
    const {title, year, director, genre, rating, cast, duration, country, age_group} = req.body
    if (!title || !year || !director || !genre || !rating || !cast || !duration || !country || !age_group) {
        throw new customError.BadRequestError('please enter all required fields');
    }
    const movie = await Movie.create(req.body)
    res.status(StatusCodes.CREATED).json({success: true,data: movie})
}

const getAllMovies = async (req, res) => {
    res.status(StatusCodes.OK).json({success: true, msg:'get all movies'})
}

module.exports = {createMovie,getAllMovies}