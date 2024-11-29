const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A tour mast have a difficulty'],
        trim: true
    },
    type: {
        type: String,
        enum: ['movie', 'series'],
        default: 'movie'
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
    ratingsAverage: {
        type: Number,
        min: [1, 'rating must be above 1'],
        max: [5, 'rating must be below 5'],
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    cast: {
        type: [{name: String}],
        required: [true, 'cast is required'],
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
    awards: {
        type: String,
    },
    top_movie: {
        type: Boolean,
        default: false
    },
    imdb_rate: {
        type: Number
    },
    num_of_imdb_rate: {
        type: Number,
    },
    num_of_review: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    picture_url: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    network: {type: String},
    isDubbed: {type: Boolean},
    hasSubtitles: {type: Boolean},
    isOnline: {type: Boolean}
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

MovieSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'movie',
    localField: '_id'
});

module.exports = mongoose.model('Movie', MovieSchema);