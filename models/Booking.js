const mongoose = require('mongoose');

// Define the ParkingBooking schema
const parkingBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model for the person making the booking
    required: true,
  },
  parkingSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace', // Assuming you have a ParkingSpace model
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Cancelled'],
    default: 'Pending',
  },
});

// Create and export the ParkingBooking model
const ParkingBooking = mongoose.model('ParkingBooking', parkingBookingSchema);

module.exports = ParkingBooking;
