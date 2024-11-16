const express = require('express');
const {
    favoriteMovie,
    movieList,
    rateMovie,
    getAllFavoriteMovie,
    getAllUserList,
    getAllUserReview,
    getAllUserRate,
    updateList,
    getSingleList,
    deleteList,
    createRequestMovie,
    getAllRequestedMovies,
    handleRequestMovie
} = require('../controllers/userController')
const {createTicket,getAllTickets,getAllUserTicket,deleteTicket} = require('../controllers/ticketController')
const {authenticatedUser,authorizePermission} = require('../middleware/authentication');
const router = express.Router();

router.route('/favorite').post(authenticatedUser, favoriteMovie).get(getAllFavoriteMovie);
router.route('/list').post(authenticatedUser, movieList).get(getAllUserList)
router.route('/list/:id').patch(authenticatedUser, updateList).get(getSingleList).delete(authenticatedUser,deleteList)
router.route('/reviews').get(getAllUserReview)
router.route('/ticket').post(authenticatedUser,createTicket).get(authenticatedUser,getAllUserTicket)
router.route('/ticket/:id').delete(authenticatedUser,authorizePermission('admin'),deleteTicket)
router.route('/all-ticket').get(authenticatedUser,authorizePermission('admin'),getAllTickets)
router.route('/rate-movie').post(authenticatedUser, rateMovie).get(getAllUserRate)
router.route('/request').post(authenticatedUser,createRequestMovie).get(authenticatedUser,authorizePermission('admin'),getAllRequestedMovies)
router.route('/handle-request').post(authenticatedUser,authorizePermission('admin'),handleRequestMovie)

module.exports = router