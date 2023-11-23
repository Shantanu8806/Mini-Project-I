const mongoose = require('mongoose');

// Define the ParkingSpace schema
const parkingSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
  occupant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model for occupants
    default: null,
  },
});

// Create and export the ParkingSpace model
module.exports=mongoose.model('Space', parkingSpaceSchema);
