const mongoose = require('mongoose');

const RequestMovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    type: {
        type: String,
        enum: ['movie', 'series'],
        default: 'movie'
    },
    releaseYear: {
        type: Number,
        required: [true, 'release year is required']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'user is required'],
    },
    handled:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('Request',RequestMovieSchema)