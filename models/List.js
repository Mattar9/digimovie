const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxLength:70
    },
    listType:{
        type: String,
        enum: ['movie','series','actor'],
        default: 'movie'
    },
    description:{
        type: String,
        maxLength:200,
    },
    privateList:{
        type: Boolean,
        default: false
    },
    count:{
        type: Number,
    },
    listItem:{
        type:[mongoose.Types.ObjectId],
        ref:'Movie',
        required:[true, 'items id is required'],
    },
    created_at:{
        type: Date,
        default: Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, 'user is required'],
    }
})

module.exports = mongoose.model('List', ListSchema);