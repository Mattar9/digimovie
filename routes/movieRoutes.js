const express = require('express');
const {createMovie,getAllMovies,getMovie,searchMovie,assignTopMovie,getAllTopMovies,getMovieByCast} = require('../controllers/movieControllers');
const {authenticatedUser,authorizePermission} = require('../middleware/authentication');
const router = express.Router();

router.route('/').get(getAllMovies).post(createMovie)
router.route('/top-movie').post(authenticatedUser,authorizePermission('admin'),assignTopMovie).get(getAllTopMovies)
router.route('/search').get(searchMovie)
router.route('/actor/:actor').get(getMovieByCast)
router.route('/:id').get(getMovie)

module.exports = router;