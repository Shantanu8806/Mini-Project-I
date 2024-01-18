const mongoose = require('mongoose');

const parkingSpaceSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
  },
  parkingNumber: {
    type: String,
    required: true,
  },
  parkingAreaDescription: {
    type: String,
    required: true,
  },
  previousBookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  ],
  hourlyCost: {
    type: Number,
    required: true,
  },
  dailyCost: {
    type: Number,
    required: true,
  },
  weeklyCost: {
    type: Number,
    required: true,
  },
  monthlyCost: {
    type: Number,
    required: true,
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
  occupant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    default: null,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  parkingSpaceImage: {
    type: String,
    required:true,
  },
});

const ParkingSpace = mongoose.model('ParkingSpace', parkingSpaceSchema);

module.exports = ParkingSpace;
