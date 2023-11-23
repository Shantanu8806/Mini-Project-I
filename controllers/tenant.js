const ParkingSpace = require('../models/parkingSpace');
const ParkingBooking = require('../models/parkingBooking');
const User = require('../models/user');

// Controller function for tenant to book and make payment
const bookAndPayParkingSpace = async (req, res) => {
  try {
    const { tenantId, parkingSpaceId, startTime, endTime, paymentScreenshot } = req.body;

    // Find the parking space
    const parkingSpace = await ParkingSpace.findById(parkingSpaceId);

    if (!parkingSpace) {
      return res.status(404).json({ error: 'Parking space not found' });
    }

    // Create a booking for the parking space
    const newBooking = new ParkingBooking({
      user: tenantId,
      parkingSpace: parkingSpaceId,
      startTime,
      endTime,
      status: 'Pending', // You might want to add a status field to track payment status
    });

    await newBooking.save();

    // Return the owner's UPI barcode (assuming it is stored in the User model)
    const owner = await User.findById(parkingSpace.owner);

    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    res.json({ message: 'Booking created successfully', ownerUpiBarcode: owner.upiBarcode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { bookAndPayParkingSpace };
