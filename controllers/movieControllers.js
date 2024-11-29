const customError = require('../errors');
const Movie = require('../models/Movie');
const {StatusCodes} = require('http-status-codes')

const createMovie = async (req, res) => {
    const {title, year, director, genre, cast, duration, country, age_group} = req.body
    if (!title || !year || !director || !genre || !cast || !duration || !country || !age_group) {
        throw new customError.BadRequestError('please enter all required fields');
    }
    const movie = await Movie.create(req.body)
    res.status(StatusCodes.CREATED).json({success: true, data: movie})
}

const getMovie = async (req, res) => {
    const {id} = req.params
    const movie = await Movie.findById(id).populate({path: 'reviews'});
    movie.views++
    await movie.save({validateBeforeSave:false})
    res.status(StatusCodes.OK).json({success: true, data: movie})
}

const getAllMovies = async (req, res) => {
    const movies = await Movie.find()
    res.status(StatusCodes.OK).json({success: true, count: movies.length, data: movies})
}

const searchMovie = async (req, res) => {
    const {
        advanced_search,
        adv_post_type,
        avg_director,
        adv_cast,
        min_release,
        max_release,
        adv_country,
        adv_age,
        adv_genre,
        min_rate,
        max_rate,
        adv_quality,
        adv_network,
        adv_order,
        adv_dubbed,
        adv_subtitle,
        adv_online
    } = req.query;
    console.log(req.query);
    // Constructing the query object
    let query = {};

    if (advanced_search !== 'on') throw new customError.BadRequestError('you are not able to search in a advanced way')
    if (adv_post_type) query.type = adv_post_type;
    if (avg_director) {
        const regex = new RegExp(avg_director, 'i');
        query.director = {$regex: regex};
    }
    // too long to solve this
    if (adv_cast) {
        const regex = new RegExp(`^${adv_cast}`, 'i')
        query.cast = {$elemMatch: {name: regex}}
    }
    if (min_release && max_release) query.year = {$gte: min_release, $lte: max_release};
    if (adv_country !== '0' && adv_country !== undefined) query.country = adv_country;
    if (adv_genre) query.genre = adv_genre;
    if (min_rate && max_rate) query.ratingsQuantity = {$gte: min_rate, $lte: max_rate};
    if (adv_quality) query.quality = adv_quality;
    if (adv_network !== '0' && adv_network !== undefined) query.network = adv_network
    if (Number(adv_dubbed) === 1) query.isDubbed = !!adv_dubbed;
    if (adv_age !== '0' && adv_age !== undefined) query.age_group = adv_age;
    if (Number(adv_subtitle) === 1) query.hasSubtitles = !!adv_subtitle;
    if (Number(adv_online)) query.isOnline = !!adv_online;

    // Sorting
    let sort;
    if (adv_order === 'publish_date') sort = '-createAt'
    if (adv_order === 'imdb_rate') sort = '-imdb_rate'
    if (adv_order === 'vote_count') sort = '-num_of_imdb_rate'
    if (adv_order === 'critics_rate_movie') sort = '-metacritic_rate'
    if (adv_order === 'comment_count') sort = '-num_of_review'
    if (adv_order === 'post_views_count') sort = '-views'

    const movies = await Movie.find(query).sort(sort);

    res.status(StatusCodes.OK).json({success: true, count: movies.length, data: movies});
}

const assignTopMovie = async (req, res) => {
    const {id} = req.body
    const movie = await Movie.findOne({_id: id})
    if (movie.type === 'series') {
        throw new customError.BadRequestError('you cant assign a series into the top movies')
    }
    movie.top_movie = true
    await movie.save({validateBeforeSave: false})
    res.status(StatusCodes.OK).json({success: true, msg: 'operation done successfully'})
}

const getAllTopMovies = async (req, res) => {
    const movies = await Movie.find({top_movie: true})
    res.status(StatusCodes.OK).json({success: true, data: movies})
}

const getMovieByCast = async (req, res) => {
    const {actor} = req.params
    const movie = await Movie.find({cast: {$elemMatch: {name: actor}}})
    res.status(StatusCodes.OK).json({success: true, count: movie.length, data: movie})
}

module.exports = {createMovie, getAllMovies, getMovie, searchMovie, assignTopMovie, getAllTopMovies, getMovieByCast}