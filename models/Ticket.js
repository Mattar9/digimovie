const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required'],
        trim: true,
        min: 5,
        max: 30
    },
    message: {
        type: String,
        required: [true, 'message is required'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'user is required'],
    },
    imageFile: {
        type: String,
    }
})

module.exports = mongoose.model('Ticket', TicketSchema);