const express = require('express');
const router = express.Router();
const { bookParkingSpace, getAllPreviousBookings, getPendingBookings } = require('../controllers/Booking');
const { authenticateTenant, authenticateOwner } = require('../middlewares/auth');

// Middleware for Cloudinary file uploads (if needed)
// const cloudinaryUpload = require('../middlewares/cloudinaryUpload');

// Routes for booking operations
router.post('/book-parking-space', authenticateTenant, /* cloudinaryUpload, */ bookParkingSpace);





// Route for owners to get all previous bookings
router.get('/previous-bookings',getAllPreviousBookings);

// router.get('/pending-bookings',getPendingBookings);

module.exports = router;
