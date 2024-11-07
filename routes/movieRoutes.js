const express = require('express');
const {createMovie,getAllMovies,getMovie} = require('../controllers/movieControllers');
const router = express.Router();

router.route('/').get(getAllMovies).post(createMovie)
router.route('/:id').get(getMovie)

module.exports = router;