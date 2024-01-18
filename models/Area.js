const mongoose = require('mongoose');
const ParkingSpace = require('./Space'); // Assuming you have a ParkingSpace model

// Define the ParkingArea schema
const parkingAreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  parkingSpaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace', // Reference to ParkingSpace model
  }],
});

// Create and export the ParkingArea model
const ParkingArea = mongoose.model('ParkingArea', parkingAreaSchema);

module.exports = ParkingArea;
