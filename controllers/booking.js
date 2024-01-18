const cloudinary = require('cloudinary').v2;
const ParkingBooking = require('../models/Booking');
const ParkingSpace = require('../models/Space');

// Configure Cloudinary with your credentials
// Controller function for a tenant booking a parking space
const bookParkingSpace = async (req, res) => {
  try {
    // Extract booking data from the request body
    const { tenantId, parkingSpaceId, startTime, endTime } = req.body;

    // Check if the tenant already has an existing booking for the specified time
    const existingBooking = await ParkingBooking.findOne({
      tenant: tenantId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'You already have a booking for this time period' });
    }

    // Check if the parking space exists
    const parkingSpace = await ParkingSpace.findById(parkingSpaceId);
    if (!parkingSpace) {
      return res.status(400).json({ error: 'Parking space does not exist' });
    }

    // Check if the parking space is available
    if (parkingSpace.isOccupied) {
      return res.status(400).json({ error: 'Parking space is not available' });
    }

    // Extract payment screenshot data from the request body
    const paymentScreenshot = req.file.path;

    // Upload payment screenshot to Cloudinary
    const result = await cloudinary.uploader.upload(paymentScreenshot);

    // Create a new parking booking
    const newBooking = new ParkingBooking({
      tenant: tenantId,
      parkingSpace: parkingSpaceId,
      startTime,
      endTime,
      paymentScreenshot: result.secure_url, // Save Cloudinary URL in the database
    });

    // Save the booking to the database
    await newBooking.save();

    // Update the parking space occupancy status and occupant
    // parkingSpace.isOccupied = true; // This will be set by the owner upon successful verification of payment
    parkingSpace.occupant = tenantId;
    await parkingSpace.save();

    res.status(201).json({ message: 'Parking space booked successfully', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ... (getPreviousBookings remains the same)
const getAllPreviousBookings = async (req, res) => {
  try {
    const tenantId = req.user.userId; // Assuming the tenant's user ID is stored in the token

    // Find all previous bookings for the tenant
    const previousBookings = await ParkingBooking.find({
      tenant: tenantId,
      endTime: { $lt: new Date() }, // Filter bookings with endTime in the past
    })
    .populate('parkingSpace', 'location') // Populate parking space information in the result
    .sort({ endTime: 'desc' }); // Sort bookings by endTime in descending order

    res.json({ message: 'All previous bookings retrieved successfully', bookings: previousBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getAllPreviousBookings,bookParkingSpace };

// const getPendingBookings = async (req, res) => {
//   try {
//     // Use Mongoose to find parking bookings with pending approval status
//     const pendingBookings = await ParkingBooking.find({ approvalStatus: 'pending' })
//       .populate('tenant', 'fullName email') // Populate the 'tenant' field with selected fields
//       .populate('parkingSpace', 'location'); // Populate the 'parkingSpace' field with selected fields

//     res.status(200).json({ pendingBookings });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// module.exports = { getPendingBookings };
 
