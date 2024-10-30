const express = require('express');
const {createMovie,getAllMovies} = require('../controllers/movieControllers');
const router = express.Router();

router.route('/').get(getAllMovies).post(createMovie)

module.exports = router;