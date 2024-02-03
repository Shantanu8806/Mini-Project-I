const mongoose = require('mongoose');

// Define the ParkingBooking schema
const parkingBookingSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant', // Assuming you have a User model for the person making the booking
    required: true,
  },
  parkingSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace', // Assuming you have a ParkingSpace model
    required: true,
  },
  typeofBooking: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'hourly'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Expired'],
    default: 'Active',
  },
  amountPaid:{
    type:Number,
    required:true
  },
  paymentId: {
    type: String, // Razorpay payment ID
    required: true,
  },
  totalTimeInHours: {
    type: Number, // Duration in hours until which the booking is valid
    required: true,
  },
  totalTimeExpiresAt: {
    type: Date, // Timestamp indicating when the booking will expire
    required: true,
  },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Set up a middleware to automatically set status to 'Expired' once totalTimeExpiresAt is reached
parkingBookingSchema.pre('save', async function (next) {
  if (Date.now() >= this.totalTimeExpiresAt) {
    this.status = 'Expired';

    // Update the parking space occupancy status and occupant
    const parkingSpace = await mongoose.model('ParkingSpace').findById(this.parkingSpace);
    if (parkingSpace) {
      parkingSpace.isOccupied = false;
      parkingSpace.occupant = null;
      await parkingSpace.save();
    }
  }
  next();
});


// Create and export the ParkingBooking model
const ParkingBooking = mongoose.model('ParkingBooking', parkingBookingSchema);

module.exports = ParkingBooking;
