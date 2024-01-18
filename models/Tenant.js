const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String, // Assuming the profilePic will be a URL to the image
    required: true,
  },
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
