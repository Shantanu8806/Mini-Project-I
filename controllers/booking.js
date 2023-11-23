const ParkingBooking = require('../models/parkingBooking');
const ParkingSpace = require('../models/Space');
const User = require('../models/user');

// Controller function for booking a parking space
const bookParkingSpace = async (req, res) => {
  try {
    // Extract data from the request body
    const { userId, parkingSpaceId, startTime, endTime } = req.body;

    // Check if the user and parking space exist
    const user = await User.findById(userId);
    const parkingSpace = await ParkingSpace.findById(parkingSpaceId);

    if (!user || !parkingSpace) {
      return res.status(404).json({ error: 'User or parking space not found' });
    }

    // Check if the parking space is available for the specified time range
    const existingBooking = await ParkingBooking.findOne({
      parkingSpace: parkingSpaceId,
      $or: [
        {
          startTime: { $gte: startTime, $lt: endTime },
        },
        {
          endTime: { $gt: startTime, $lte: endTime },
        },
      ],
    });

    if (existingBooking) {
      return res.status(409).json({ error: 'Parking space is already booked for the specified time range' });
    }

    // Create a new booking
    const newBooking = new ParkingBooking({
      user: userId,
      parkingSpace: parkingSpaceId,
      startTime,
      endTime,
    });

    // Save the booking to the database
    await newBooking.save();

    // Update the status of the parking space to 'Occupied'
    parkingSpace.isOccupied = true;
    parkingSpace.occupant = userId;
    await parkingSpace.save();

    // Return the booking details in the response
    res.status(201).json({ message: 'Parking space booked successfully', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { bookParkingSpace };
