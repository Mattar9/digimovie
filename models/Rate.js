const mongoose = require('mongoose');
const Movie = require('../models/Movie');

const RateSchema = new mongoose.Schema({
    rating:{
        type: Number,
        required: [true,'rate is required'],
        min:1,
        max:5
    },
    movie:{
        type:mongoose.Schema.ObjectId,
        ref:'Movie',
        required: [true, 'movie id is required'],
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'user id is required'],
    }
})

RateSchema.index({ movie: 1, user: 1 }, { unique: true });

RateSchema.statics.calcAverageRatingsReview = async function(movieId) {
    const stats = await this.aggregate([
        {
            $match: { movie: movieId }
        },
        {
            $group: {
                _id: 'movie',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await Movie.findByIdAndUpdate(movieId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Movie.findByIdAndUpdate(movieId, {
            ratingsQuantity: 0,
            ratingsAverage: 0
        });
    }
};

RateSchema.post('save', function() {
    this.constructor.calcAverageRatingsReview(this.movie);
});


module.exports = mongoose.model('Rate', RateSchema);