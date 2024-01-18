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
  startTime: {
    type: Date, // For daily, weekly, and monthly bookings, this will store the date and time
    required: true,
  },
  endTime: {
    type: Date, // For daily, weekly, and monthly bookings, this will store the date and time
    required: true,
    validate: {
      validator: function(value) {
        // Validate that endTime is greater than or equal to startTime
        return value >= this.startTime;
      },
      message: 'End time must be equal to or after start time',
    },
  },
  startHour: {
    type: String, // For hourly bookings, this will store the start time in 12-hour clock format (HH:MM AM/PM)
    validate: {
      validator: function(value) {
        // Validate that startHour is a valid time in 12-hour clock format (HH:MM AM/PM)
        return /^\d{1,2}:\d{2} (AM|PM)$/i.test(value);
      },
      message: 'Invalid start time format. Please use HH:MM AM/PM format',
    },
  },
  endHour: {
    type: String, // For hourly bookings, this will store the end time in 12-hour clock format (HH:MM AM/PM)
    validate: {
      validator: function(value) {
        // Validate that endHour is a valid time in 12-hour clock format (HH:MM AM/PM)
        return /^\d{1,2}:\d{2} (AM|PM)$/i.test(value);
      },
      message: 'Invalid end time format. Please use HH:MM AM/PM format',
    },
    validate: {
      validator: function(value) {
        // Validate that endHour is strictly greater than startHour
        if (this.startHour) {
          const startTime = parseTimeString(this.startHour);
          const endTime = parseTimeString(value);
          return endTime > startTime;
        }
        return true; // If startHour is not set, skip this validation
      },
      message: 'End time must be after start time',
    },
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

function parseTimeString(timeString) {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  return period.toLowerCase() === 'pm' ? hours + 12 + minutes / 60 : hours + minutes / 60;
}

// Create and export the ParkingBooking model
const ParkingBooking = mongoose.model('ParkingBooking', parkingBookingSchema);

module.exports = ParkingBooking;
