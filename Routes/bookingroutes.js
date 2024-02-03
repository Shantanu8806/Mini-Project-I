const express = require('express');
const router = express.Router();
const {createOrder,getRazorpayKeyController} = require('../controllers/Payment');
const { initiateBookingAfterPayment, getAllPreviousBookingsByOwner, getActiveBookingsByTenantId,getActiveBookingByParkingSpaceId,getPreviousBookingsByParkingSpaceId } = require('../controllers/Booking')
const { authenticateTenant, authenticateOwner } = require('../middlewares/auth')


// Middleware for Cloudinary file uploads (if needed)
// const cloudinaryUpload = require('../middlewares/cloudinaryUpload');

// Routes for booking operations
router.post('/book-parking-space', authenticateTenant, /* cloudinaryUpload, */ initiateBookingAfterPayment);





// Route for owners to get all previous bookings
router.get('/previous-bookings',authenticateOwner,getAllPreviousBookingsByOwner);
router.get('/getRazorpayKey',getRazorpayKeyController);
router.post('/createOrder',createOrder);
router.post('/paymentVerification',initiateBookingAfterPayment);
router.get('/getActiveBookingsByTenantId',getActiveBookingsByTenantId);
router.get('/getAllBookingsByTenantId',authenticateTenant,getActiveBookingsByTenantId);
router.get('/getActiveBookingByParkingSpaceId',getActiveBookingByParkingSpaceId);
router.get('/getPreviousBookingsByParkingSpaceId',getPreviousBookingsByParkingSpaceId);

// router.get('/pending-bookings',getPendingBookings);

module.exports = router;
