const CustomError = require("../errors");
const path = require("path");
const {StatusCodes} = require("http-status-codes");
const Ticket = require("../models/Ticket");
const customError = require("../errors");

const createTicket = async (req, res) => {
    const {userId} = req.user;
    const {title, message} = req.body;

    if (!title || !message) {
        throw new customError.BadRequestError('please enter title and message')
    }

    let imageSrc = '';

    if (req.files) {
        const productImage = req.files.image;
        if (!productImage.mimetype.startsWith('image')) {
            throw new CustomError.BadRequestError('Image format is required');
        }

        const maxSize = 1024 * 1024

        if (!productImage.size > maxSize) {
            throw new CustomError.BadRequestError('image size is bigger than maxSize');
        }

        const imagePath = path.join(__dirname, '../uploadFiles/' + `${productImage.name}`)

        await productImage.mv(imagePath);
        imageSrc = `/uploadFiles/${productImage.name}`
        const ticket = await Ticket.create({user: userId, title, message, imageFile: imageSrc})
        return res.status(StatusCodes.OK).json({success: true, data: ticket})
    }

    const ticket = await Ticket.create({user: userId, title, message, imageSrc})
    return res.status(StatusCodes.OK).json({success: true, data: ticket})
}

const getAllTickets = async (req, res) => {
    const tickets = await Ticket.find()
    res.status(StatusCodes.OK).json({success: true,count:tickets.length, data: tickets})
}

const getAllUserTicket = async (req, res) => {
    const {userId} = req.user;
    const ticket = await Ticket.find({user: userId})
    res.status(StatusCodes.OK).json({success: true,count:ticket.length, data: ticket})
}

const deleteTicket = async (req, res) => {
    const {id} = req.params
    await Ticket.findOneAndDelete(id)
    res.status(StatusCodes.OK).json({success: true, msg: 'Ticket deleted successfully'})
}

module.exports = {createTicket,getAllTickets,getAllUserTicket,deleteTicket}