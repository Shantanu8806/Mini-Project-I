const crypto = require('crypto');
const ParkingBooking = require('../models/Booking');
const Payment = require('../models/Payment');
const { calculateTotalTimeExpiresAt } = require('../utils/bookingUtils'); // Import utility to calculate total time expiry (provided below)
const Parkingspace = require('../models/Space');
const initiateBookingAfterPayment = async (req, res) => {
  try {
    // Extract data from the payment verification request body
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log('Payment verification request body:', req.body);
    // Validate the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
    const isAuth = expectedSignature === razorpay_signature;

    if (isAuth) {
      const payment = await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      const bookingDataString = req.query.bookingData || req.body.bookingData;
      const bookingData = JSON.parse(decodeURIComponent(bookingDataString));

      // Now you can use the bookingData in your logic
      const { tenantId, parkingSpaceId, typeofBooking, totalTimeInHours } = bookingData;
      console.log('Booking data:', bookingData);

      // Check if the tenant already has an existing booking for the specified time
      const existingBooking = await ParkingBooking.findOne({
        tenant: tenantId,
        status: 'Active',
      });

      if (existingBooking) {
        return res.status(400).json({ success: false, error: 'You already have an active booking' });
      }

      // Check if the parking space exists
      const parkingSpace = await Parkingspace.findById(parkingSpaceId);
      if (!parkingSpace) {
        return res.status(400).json({ success: false, error: 'Parking space does not exist' });
      }

      // Check if the parking space is available
      if (parkingSpace.isOccupied) {
        return res.status(400).json({ success: false, error: 'Parking space is not available' });
      }

      // Create a new parking booking
      const newBooking = new ParkingBooking({
        tenant: tenantId,
        parkingSpace: parkingSpaceId,
        typeofBooking,
        paymentId: payment._id,
        totalTimeInHours,
        totalTimeExpiresAt: calculateTotalTimeExpiresAt(totalTimeInHours), // Calculate expiry timestamp
      });

      // Save the booking to the database
      await newBooking.save();
      console.log(newBooking);

      // Update the parking space occupancy status and occupant
      parkingSpace.isOccupied = true;
      parkingSpace.occupant = tenantId;
      await parkingSpace.save();
      console.log('Parking space booked successfully');
      res.status(200).json({ success: true, message: 'Parking space booked successfully' });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error during payment verification and booking initiation:', error);
    console.log('Error while verifying payment');
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getActiveBookingsByTenantId = async (req, res) => {
  const { tenantId } = req.query; // Get tenantId from query parameters

  try {
    // Find active bookings for the given tenantId
    const activeBookings = await ParkingBooking.find({
      tenant: tenantId,
      status: 'Active',
    }).populate('parkingSpace', 'name'); // Populate the parkingSpace field with its name (or other desired fields)

    res.json(activeBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookingsByTenantId = async (req, res) => {
  const { tenantId } = req.query; // Get tenantId from query parameters

  try {
    // Find all bookings for the given tenantId
    const allBookings = await ParkingBooking.find({
      tenant: tenantId,
    }).populate('parkingSpace', 'name'); // Populate the parkingSpace field with its name (or other desired fields)

    res.json(allBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPreviousBookingsByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId; // Assuming ownerId is passed as a parameter or available in the request

    // Retrieve all bookings for the owner
    const bookings = await ParkingBooking.find({
      'parkingSpace.owner': ownerId,
      status: { $in: ['Completed', 'Cancelled'] }, // Filter by completed or cancelled status
    })
    .populate('tenant', 'name email') // Populate the 'tenant' field with selected fields
    .populate('parkingSpace', 'address'); // Populate the 'parkingSpace' field with selected fields

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching previous bookings by owner:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getActiveBookingByParkingSpaceId = async (req, res) => {
  const { parkingSpaceId } = req.body; // Get parkingSpaceId from request body

  try {
    // Find active booking for the given parkingSpaceId
    const activeBooking = await ParkingBooking.findOne({
      parkingSpace: parkingSpaceId,
      status: 'Active',
    }).populate({
      path: 'tenant',
      select: 'fullName email contactNumber', // Include the contactNumber field from the Tenant model
    });

    if (activeBooking) {
      res.json(activeBooking);
    } else {
      res.status(404).json({ message: 'No active booking found for the specified parking space' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPreviousBookingsByParkingSpaceId = async (req, res) => {
  const { parkingSpaceId } = req.body; // Get parkingSpaceId from request body

  try {
    // Find previous bookings (status other than 'Active') for the given parkingSpaceId
    const previousBookings = await ParkingBooking.find({
      parkingSpace: parkingSpaceId,
      status: { $ne: 'Active' }, // Find bookings with status other than 'Active'
    }).populate('tenant', 'fullName email contactNumber'); // Populate the tenant field with its fullName, email, and contactNumber

    res.json(previousBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getPreviousBookingsByParkingSpaceId,getActiveBookingByParkingSpaceId, getActiveBookingsByTenantId,getAllPreviousBookingsByOwner,getAllBookingsByTenantId, initiateBookingAfterPayment, getAllPreviousBookingsByOwner };
