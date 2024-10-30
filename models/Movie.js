const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String },
})

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A tour mast have a difficulty'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'year is required']
    },
    director: {
        type: String,
        required: [true, 'director is required']
    },
    genre: {
        type: [String],
        required: [true, 'genre is required']
    },
    rating: {
        type: Number,
        required: [true, 'rating is required'],
        min:1,
        max:10,
        default:5
    },
    cast: {
        type:[castSchema]
    },
    duration: {
        type: Number,
        required: [true, 'duration is required']
    },
    plot: {
        type: String
    },
    country: {
        type: String,
        required: [true, 'country is required']
    },
    language: {
        type: String,
        default: 'English'
    },
    quality: {
        type: String
    },
    age_group: {
        type: String,
        required: [true, 'age_group is required']
    },
    authors: {
        type: [String]
    },
    metacritic_rate: {
        type: Number
    },
    imdb_rate: {
        type: Number
    },
    picture_url: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Movie', MovieSchema);