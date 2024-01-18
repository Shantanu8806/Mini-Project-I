const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  // upiBarcodeImage: {
  //   type: String,
  //   required: true,
  // },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String, // Assuming the profilePic will be a URL to the image
    required: true,
  },
});

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;
